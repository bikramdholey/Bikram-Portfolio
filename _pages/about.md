---
layout: about
title: About
permalink: /
subtitle: <a href="https://jadavpuruniversity.in/" target="_blank">Ph.D. Scholar in Mathematics, Jadavpur University</a>



profile:
  align: right
  image: prof_pic.jpg.webp
  image_circular: true

  

selected_papers: false
social: false

announcements:
 announcements:
  enabled: false
  scrollable: true
  limit: 5

latest_posts:
announcements:
  enabled: false
  scrollable: true
  limit: 3
---

## 👨‍🏫 About Me

{{ site.data.site_text.about_intro | markdownify }}

---

{% comment %}
Everything below comes from the Overleaf CV (_data/overleaf_cv.json, refreshed by
.github/workflows/sync-cv-from-overleaf.yml). Edit the CV in Overleaf, not here.
{% endcomment %}
{% assign cv = site.data.overleaf_cv %}
{% assign links = site.data.institution_links %}

## 🌐 Web Addresses

{% for w in cv.web -%}
{%- unless w.label == "Portfolio" -%}
{%- if w.value contains "://" %}
- _{{ w.label }}:_ [{{ w.value | split: "://" | last | split: "?" | first | truncate: 60 }}]({{ w.value }})
{%- elsif w.value contains "@" %}
- _{{ w.label }}:_ [{{ w.value }}](mailto:{{ w.value }})
{%- else %}
- _{{ w.label }}:_ {{ w.value }}
{%- endif -%}
{%- endunless -%}
{%- endfor %}

---

## 📘 Education

{% for e in cv.education -%}
{%- assign link = links | where: "name", e.institution | first -%}{%- assign url = link.url %}
- _{{ e.degree }}_ — {% if url %}[{{ e.institution }}]({{ url }}){% else %}{{ e.institution }}{% endif %} ({{ e.year }}){% if e.score != "" %} — {{ e.score }}{% endif %}
{%- endfor %}

---

## 🔬 Research Experience

- _Published Research Articles:_
{%- for p in cv.journal_articles %}
  1. {{ p.title }} — _{{ p.venue }}_ ({{ p.year }}){% if p.url != "" %} [{% if p.url contains "doi.org/" %}DOI{% else %}Link{% endif %}]({{ p.url }}){% endif %}
{%- endfor %}
{%- if cv.book_chapters.size > 0 %}
- _Book Chapters:_
{%- for p in cv.book_chapters %}
  1. {{ p.title }} — _{{ p.venue }}_ ({{ p.year }}){% if p.publisher != "" %}, {{ p.publisher }}{% endif %}
{%- endfor %}
{%- endif %}
{%- for g in cv.research_other %}
- _{{ g.title }}:_
{%- for item in g.items %}
  - {{ item.full }}
{%- endfor %}
{%- endfor %}

---

## 📢 Conference Presentations

{% for c in cv.conferences -%}
- _{{ c.title }}_ — {{ c.event }}{% if c.date != "" %} ({{ c.date }}){% endif %}
{% endfor %}
---

## 🎓 Seminars & Workshops

{% for s in cv.seminars -%}
- _{{ s.title }}_ — {{ s.event }}{% if s.type != "" %}  
  Type: {{ s.type }}{% endif %}{% if s.date != "" %}  
  Date: {{ s.date }}{% endif %}

{% endfor %}
---

## 📜 Achievements

{% for a in cv.awards -%}
- {{ a.text }}{% if a.date != "" %} ({{ a.date }}){% endif %}
{% endfor %}
---

## 🧑‍🏫 Teaching & Work Experience

{% for w in cv.work -%}
- {{ w.title }}{% if w.organization != "" %}, {{ w.organization }}{% endif %}{% if w.date != "" %} ({{ w.date }}){% endif %}
{% endfor %}
{%- for p in cv.plans %}
- _{{ p.title }}:_
{%- for item in p.items %}
  - {{ item }}
{%- endfor %}
{%- endfor %}

---

## 📝 Research Interests

{% for r in cv.research_interests -%}
- {{ r }}
{% endfor %}
---

## 📚 Relevant Courses / Trainings

{% for c in cv.courses -%}
- _{{ c.title }}_{% if c.kind != "" %} — {{ c.kind }}{% endif %}{% if c.organizer != "" %}  
  Organizer: {{ c.organizer }}{% endif %}

{% endfor %}
---

## 📁 Projects

{% for p in cv.projects -%}
- {{ p.text }}{% if p.date != "" %} ({{ p.date }}){% endif %}
{% endfor %}
---

## 🛠 Skills

{% for s in cv.skills -%}
- _{{ s.label }}:_ {{ s.value }}
{% endfor %}
{%- if cv.interests.size > 0 %}
- _Interests:_ {{ cv.interests | join: ", " }}
{%- endif %}
{%- if cv.extracurricular.size > 0 %}
- _Extracurricular:_ {{ cv.extracurricular | join: ", " }}
{%- endif %}

{%- for sec in cv.other_sections %}

---

## {{ sec.title }}

{% for item in sec.items -%}
- {{ item.text }}
{% endfor %}
{%- endfor %}

---

## 🌐 Languages

- Bengali, Hindi, English

---
