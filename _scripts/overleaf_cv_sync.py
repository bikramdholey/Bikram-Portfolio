#!/usr/bin/env python3
"""Convert the Overleaf CV (LaTeX) into site data.

Usage:
    python _scripts/overleaf_cv_sync.py <cv.tex> [--commit <overleaf commit sha>]

Writes:
    _data/overleaf_cv.json  structured data used by the About and Publications pages
    _data/cv.json           the same data in the shape the CV page layout expects

Sections listed in EXCLUDED_SECTIONS (personal details, referees) are never
written to the site, because those pages are public.
"""
import json
import os
import re
import sys

EXCLUDED_SECTIONS = {"PERSONAL DETAILS", "REFERENCES"}
INDEX_TAGS = {"SCIE", "SCI", "ESCI", "SCOPUS", "UGC CARE", "WOS"}

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# ---------------------------------------------------------------------------
# LaTeX -> plain text
# ---------------------------------------------------------------------------

# \href{url}{text}; the CV often breaks the line between the two arguments
HREF = r"\\href\{[^{}]*\}\s*\{((?:[^{}]|\{[^{}]*\})*)\}"


def strip_comments(tex):
    return re.sub(r"(?<!\\)%.*", "", tex)


def clean(s):
    """Turn a LaTeX fragment into readable plain text."""
    if not s:
        return ""
    s = re.sub(HREF, r"\1", s)
    s = re.sub(r"\\hfill\s*\{?\s*\[[^\]]*\]\s*\}?", "", s)
    s = re.sub(r"\\\\(\[[^\]]*\])?", " ", s)
    s = re.sub(r"\\(vspace|hspace|setlength|vphantom)\*?\{[^{}]*\}(\{[^{}]*\})?", "", s)
    s = s.replace("\\LaTeX", "LaTeX").replace("\\TeX", "TeX")
    # unwrap formatting commands, innermost first
    prev = None
    while prev != s:
        prev = s
        s = re.sub(r"\\(textbf|textit|textsc|emph|underline|nolinkurl|url|Large|large|small|footnotesize)\s*\{([^{}]*)\}", r"\2", s)
    s = re.sub(r"\\(Large|large|small|footnotesize|normalsize|hfill|noindent|centering|bfseries|itshape)\b", "", s)
    for a, b in (("\\&", "&"), ("\\_", "_"), ("\\%", "%"), ("\\$", "$"), ("\\#", "#"),
                 ("---", "—"), ("--", "–"), ("``", "“"), ("''", "”"), ("\\ ", " "), ("~", " "),
                 ("\\.", "."), ("\\,", " ")):
        s = s.replace(a, b)
    s = s.replace("{", "").replace("}", "")
    s = re.sub(r"\s+", " ", s)
    return re.sub(r"\s+,\s*", ", ", s).strip()


def first_arg(cmd, s):
    """Raw contents of the first \\cmd{...} in s (balanced braces), or None."""
    m = re.search(r"\\" + cmd + r"\s*\{", s)
    if not m:
        return None
    depth, i = 1, m.end()
    while i < len(s) and depth:
        depth += {"{": 1, "}": -1}.get(s[i], 0)
        i += 1
    return s[m.end():i - 1]


def trailing_date(s):
    m = re.search(r"\\hfill\s*\{?\s*\[([^\]]*)\]", s)
    return clean(m.group(1)) if m else None


# ---------------------------------------------------------------------------
# Structure: sections and (nested) lists
# ---------------------------------------------------------------------------

LIST_TOKEN = re.compile(r"\\begin\{(itemize|enumerate)\}(\[[^\]]*\])?|\\end\{(itemize|enumerate)\}|\\item\b")


def parse_lists(body):
    """Return the items of every top-level itemize/enumerate in body.

    Each item is {"raw": text before any nested list, "children": [...]}.
    """
    items, stack = [], []
    for m in LIST_TOKEN.finditer(body):
        tok = m.group(0)
        if tok.startswith("\\begin"):
            if stack and stack[-1]["current"] is not None and not stack[-1]["current"].get("_closed_raw"):
                cur = stack[-1]["current"]
                cur["raw"] += body[cur["_start"]:m.start()]
                cur["_closed_raw"] = True
            stack.append({"items": [], "current": None})
        elif tok.startswith("\\end"):
            if not stack:
                continue
            level = stack.pop()
            _close(level, body, m.start())
            if stack and stack[-1]["current"] is not None:
                stack[-1]["current"]["children"].extend(level["items"])
                stack[-1]["current"]["_start"] = m.end()
            elif not stack:
                items.extend(level["items"])
        else:  # \item
            if not stack:
                continue
            level = stack[-1]
            _close(level, body, m.start())
            level["current"] = {"raw": "", "children": [], "_start": m.end()}
    return [_finish(i) for i in items]


def _close(level, body, end):
    cur = level["current"]
    if cur is None:
        return
    if not cur.get("_closed_raw"):
        cur["raw"] += body[cur["_start"]:end]
    level["items"].append(cur)
    level["current"] = None


def _finish(item):
    return {"raw": item["raw"].strip(), "children": [_finish(c) for c in item["children"]]}


def split_sections(tex):
    heads = list(re.finditer(r"\\resheading\{\s*\\textbf\{([^{}]*)\}\s*\}", tex))
    end_doc = tex.find("\\end{document}")
    sections = []
    for i, h in enumerate(heads):
        stop = heads[i + 1].start() if i + 1 < len(heads) else (end_doc if end_doc != -1 else len(tex))
        sections.append((clean(h.group(1)).upper(), tex[h.end():stop]))
    preamble = tex[:heads[0].start()] if heads else tex
    return preamble, sections


# ---------------------------------------------------------------------------
# Entry parsers
# ---------------------------------------------------------------------------

def parse_header(pre):
    body = pre[pre.find("\\begin{document}"):]
    name = clean(first_arg("Large", body) or "")
    rows = []
    m = re.search(r"\\begin\{tabular\}\{[^}]*\}(.*?)\\end\{tabular\}", body, re.S)
    if m:
        rows = [[clean(c) for c in r.split("&")] for r in re.split(r"\\\\", m.group(1)) if clean(r)]
    text = clean(body)
    email = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", text)
    phone = re.search(r"Mobile:\s*([+\d][\d\s-]{7,}\d)", text)
    label = rows[1][0] if len(rows) > 1 else ""
    affiliation = rows[2][0] if len(rows) > 2 else ""
    return {
        "name": name,
        "label": label,
        "affiliation": affiliation,
        "email": email.group(0) if email else "",
        "phone": phone.group(1).strip() if phone else "",
    }


def parse_education(body):
    m = re.search(r"\\begin\{tabular\}\{[^}]*\}(.*?)\\end\{tabular\}", body, re.S)
    rows = []
    if not m:
        return rows
    for r in re.split(r"\\\\", m.group(1)):
        r = re.sub(r"\\(top|mid|bottom)rule", "", r)
        cells = [clean(c) for c in r.split("&")]
        if len(cells) < 3 or not any(cells) or cells[0].lower() == "course":
            continue
        score = cells[3] if len(cells) > 3 and cells[3].strip("-–— ") else ""
        rows.append({"degree": cells[0], "institution": cells[1], "year": cells[2], "score": score})
    return rows


def parse_pub(raw):
    url = first_arg("href", raw)
    no_link = re.sub(HREF, "", raw)
    venue_raw = first_arg("textit", no_link)
    if venue_raw is not None:
        pos = no_link.find("\\textit")
        title, rest = clean(no_link[:pos]), no_link[pos:].replace("\\textit{" + venue_raw + "}", "", 1)
    else:
        parts = no_link.split("|", 1)
        title, rest = clean(parts[0]), (parts[1] if len(parts) > 1 else "")
    pub = {"title": title.rstrip(". "), "venue": clean(venue_raw or ""), "year": "",
           "indexing": [], "impact_factor": "", "quartile": "", "isbn": "", "publisher": "",
           "url": clean(url) if url else ""}
    for part in (clean(p) for p in rest.split("|")):
        part = part.strip(" .")
        if not part:
            continue
        up = part.upper()
        if re.fullmatch(r"(19|20)\d\d", part):
            pub["year"] = part
        elif up in INDEX_TAGS:
            if part not in pub["indexing"]:
                pub["indexing"].append(part)
        elif up.startswith("IF"):
            pub["impact_factor"] = part.split(":", 1)[-1].strip()
        elif re.fullmatch(r"Q[1-4]", up):
            pub["quartile"] = up
        elif up.startswith("ISBN"):
            pub["isbn"] = part.split(":", 1)[-1].strip()
        elif up == "BOOK CHAPTER":
            continue
        else:
            pub["publisher"] = part
    return pub


def parse_event(raw):
    title_raw = first_arg("textbf", raw) or ""
    date = trailing_date(raw)
    kind = re.search(r"\[Type:\s*([^\]]*)\]", raw)
    rest = raw.replace("\\textbf{" + title_raw + "}", "", 1)
    rest = re.sub(r"\[Type:[^\]]*\]", "", rest)
    rest = clean(rest).strip(" ,.")
    return {"title": clean(title_raw).rstrip(","), "event": rest,
            "type": clean(kind.group(1)) if kind else "", "date": date or ""}


def parse_award(raw):
    title_raw = first_arg("textbf", raw) or ""
    text = clean(raw)
    title = clean(title_raw)
    detail = text[len(title):].strip(" ,") if text.startswith(title) else text
    detail = re.sub(r"^at\s+", "", detail)
    return {"title": title or text, "detail": detail if title else "", "date": trailing_date(raw) or "", "text": text}


def parse_titled(raw, children):
    """'\\textbf{A | B}\\hfill{[date]}' with child bullet points."""
    head = clean(first_arg("textbf", raw) or raw)
    parts = [p.strip() for p in head.split("|")]
    return {"title": parts[0], "organization": " | ".join(parts[1:]),
            "date": trailing_date(raw) or "", "details": [clean(c["raw"]) for c in children]}


def parse_course(raw):
    head = clean(first_arg("textbf", raw) or raw)
    parts = [p.strip() for p in head.split("|")]
    return {"title": parts[0], "kind": " | ".join(parts[1:]), "organizer": trailing_date(raw) or ""}


def parse_labeled(raw):
    text = clean(raw)
    label, sep, value = text.partition(":")
    return {"label": label.strip(), "value": value.strip()} if sep else {"label": "", "value": text}


def generic(items):
    return [{"text": clean(i["raw"]), "date": trailing_date(i["raw"]) or "",
             "children": generic(i["children"])} for i in items]


# ---------------------------------------------------------------------------
# Main conversion
# ---------------------------------------------------------------------------

def convert(tex):
    tex = strip_comments(tex)
    pre, sections = split_sections(tex)
    data = {"profile": parse_header(pre), "objective": [], "education": [],
            "journal_articles": [], "book_chapters": [], "research_other": [],
            "conferences": [], "seminars": [], "awards": [], "work": [], "plans": [],
            "research_interests": [], "courses": [], "projects": [], "skills": [],
            "interests": [], "extracurricular": [], "web": [], "other_sections": [],
            "section_order": []}

    for title, body in sections:
        if title in EXCLUDED_SECTIONS:
            continue
        data["section_order"].append(title)
        items = parse_lists(body)
        if title == "OBJECTIVE":
            data["objective"] = [clean(i["raw"]) for i in items]
        elif title == "ACADEMIC BACKGROUND":
            data["education"] = parse_education(body)
        elif title == "RESEARCH EXPERIENCE":
            for group in items:
                label = clean(group["raw"]).lower()
                if "journal" in label or "article" in label:
                    data["journal_articles"] = [parse_pub(c["raw"]) for c in group["children"]]
                elif "book" in label or "chapter" in label:
                    data["book_chapters"] = [parse_pub(c["raw"]) for c in group["children"]]
                else:
                    data["research_other"].append({"title": clean(group["raw"]),
                                                   "items": [clean(c["raw"]) for c in group["children"]]})
        elif title.startswith("CONFERENCE"):
            data["conferences"] = [parse_event(i["raw"]) for i in items]
        elif title.startswith("SEMINAR"):
            data["seminars"] = [parse_event(i["raw"]) for i in items]
        elif "ACHIEVEMENT" in title or "AWARD" in title:
            data["awards"] = [parse_award(i["raw"]) for i in items]
        elif title.startswith("WORK") or title == "EXPERIENCE":
            data["work"] = [parse_titled(i["raw"], i["children"]) for i in items]
        elif "PLAN" in title:
            data["plans"] = [{"title": clean(i["raw"]), "items": [clean(c["raw"]) for c in i["children"]]}
                             for i in items]
        elif title == "RESEARCH INTERESTS":
            data["research_interests"] = [clean(i["raw"]) for i in items]
        elif "COURSE" in title or "TRAINING" in title:
            data["courses"] = [parse_course(i["raw"]) for i in items]
        elif title.startswith("PROJECT"):
            data["projects"] = [{"text": clean(i["raw"]), "date": trailing_date(i["raw"]) or ""} for i in items]
        elif title == "SKILLS":
            data["skills"] = [parse_labeled(i["raw"]) for i in items]
        elif title == "INTERESTS":
            data["interests"] = [clean(i["raw"]) for i in items]
        elif "EXTRACURRICULAR" in title:
            data["extracurricular"] = [clean(i["raw"]) for i in items]
        elif title.startswith("WEB"):
            data["web"] = [parse_labeled(i["raw"]) for i in items]
        else:
            data["other_sections"].append({"title": title.title(), "items": generic(items)})

    # newest first, keeping the CV's own order within a year
    for key in ("journal_articles", "book_chapters"):
        data[key] = sorted(reversed(data[key]), key=lambda p: p["year"] or "0", reverse=True)
    return no_pipes(data)


def no_pipes(v):
    """Markdown reads a leftover '|' as a table column, so use a middle dot instead."""
    if isinstance(v, str):
        return re.sub(r"\s*\|\s*", " · ", v)
    if isinstance(v, list):
        return [no_pipes(x) for x in v]
    if isinstance(v, dict):
        return {k: no_pipes(x) for k, x in v.items()}
    return v


def pub_line(p):
    bits = [p["venue"]]
    if p["indexing"]:
        bits.append(", ".join(p["indexing"]))
    if p["impact_factor"]:
        bits.append("IF " + p["impact_factor"])
    if p["quartile"]:
        bits.append(p["quartile"])
    if p["isbn"]:
        bits.append("ISBN " + p["isbn"])
    if p["publisher"]:
        bits.append(p["publisher"])
    return " · ".join(b for b in bits if b)


def to_cv_layout(d):
    """Build the list the al-folio CV layout (_layouts/cv.liquid) renders."""
    pr = d["profile"]
    cv = [{"title": "General Information", "type": "map", "contents": [
        c for c in (
            {"name": "Full Name", "value": pr["name"]},
            {"name": "Position", "value": pr["label"]},
            {"name": "Affiliation", "value": pr["affiliation"]},
            {"name": "Email", "value": pr["email"]},
        ) if c["value"]]}]
    if d["education"]:
        cv.append({"title": "Education", "type": "time_table", "contents": [
            {"title": e["degree"], "institution": e["institution"], "year": e["year"],
             "description": ["CGPA / %: " + e["score"]] if e["score"] else []} for e in d["education"]]})
    if d["work"]:
        cv.append({"title": "Work Experience", "type": "time_table", "contents": [
            {"title": w["title"], "institution": w["organization"], "year": w["date"],
             "description": w["details"]} for w in d["work"]]})
    if d["journal_articles"]:
        cv.append({"title": "Journal Articles", "type": "time_table", "contents": [
            {"title": p["title"], "institution": pub_line(p), "year": p["year"],
             "description": [p["url"]] if p["url"] else []} for p in d["journal_articles"]]})
    if d["book_chapters"]:
        cv.append({"title": "Book Chapters", "type": "time_table", "contents": [
            {"title": p["title"], "institution": pub_line(p), "year": p["year"]} for p in d["book_chapters"]]})
    for g in d["research_other"]:
        cv.append({"title": g["title"], "type": "list", "contents": g["items"]})
    if d["conferences"]:
        cv.append({"title": "Conference & Seminar Presentations", "type": "time_table", "contents": [
            {"title": c["title"], "institution": c["event"], "year": c["date"],
             "description": [c["type"]] if c["type"] else []} for c in d["conferences"]]})
    if d["seminars"]:
        cv.append({"title": "Seminars & Workshops", "type": "time_table", "contents": [
            {"title": s["title"], "institution": s["event"], "year": s["date"],
             "description": [s["type"]] if s["type"] else []} for s in d["seminars"]]})
    if d["awards"]:
        cv.append({"title": "Scholastic Achievements", "type": "time_table", "contents": [
            {"title": a["title"], "institution": a["detail"], "year": a["date"]} for a in d["awards"]]})
    for p in d["plans"]:
        cv.append({"title": p["title"], "type": "list", "contents": p["items"]})
    if d["research_interests"]:
        cv.append({"title": "Research Interests", "type": "list", "contents": d["research_interests"]})
    if d["courses"]:
        cv.append({"title": "Relevant Courses / Trainings", "type": "list", "contents": [
            " | ".join(x for x in (c["title"], c["kind"], c["organizer"]) if x) for c in d["courses"]]})
    if d["projects"]:
        cv.append({"title": "Projects", "type": "list", "contents": [
            p["text"] + (f" ({p['date']})" if p["date"] else "") for p in d["projects"]]})
    if d["skills"]:
        cv.append({"title": "Skills", "type": "map", "contents": [
            {"name": s["label"], "value": s["value"]} for s in d["skills"]]})
    if d["interests"]:
        cv.append({"title": "Interests", "type": "list", "contents": d["interests"]})
    if d["extracurricular"]:
        cv.append({"title": "Extracurricular Activities", "type": "list", "contents": d["extracurricular"]})
    for s in d["other_sections"]:
        cv.append({"title": s["title"], "type": "list", "contents": [i["text"] for i in s["items"]]})
    return cv


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    commit = ""
    if "--commit" in args:
        i = args.index("--commit")
        commit = args[i + 1]
        del args[i:i + 2]
    with open(args[0], encoding="utf-8") as f:
        data = convert(f.read())
    data["source_commit"] = commit

    if not data["journal_articles"] or not data["profile"]["name"]:
        sys.exit("Parsed CV looks empty (no name or journal articles); refusing to overwrite site data.")

    out_dir = os.path.join(REPO_ROOT, "_data")
    for name, payload in (("overleaf_cv.json", data), ("cv.json", to_cv_layout(data))):
        with open(os.path.join(out_dir, name), "w", encoding="utf-8", newline="\n") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
            f.write("\n")
    print(f"Synced CV: {len(data['journal_articles'])} articles, {len(data['book_chapters'])} chapters, "
          f"{len(data['conferences'])} conferences, sections: {', '.join(data['section_order'])}")


if __name__ == "__main__":
    main()
