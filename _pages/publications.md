---
layout: default
permalink: /publications/
title: Publications
description: Published research papers and featured visuals.
nav: true
nav_order: 87
---

<style>
  .teal-accent {
    color: #00695c;
    font-weight: 600;
  }

  .deep-teal {
    color: #004d40;
    font-weight: 700;
  }

  .section-title {
    color: var(--accent-strong, #004d40);
    border-bottom: 2px solid var(--accent, #00695c);
    padding-bottom: 6px;
    margin-top: 25px;
  }

  /* Per-section palettes: teal (articles), deep blue (conferences), amber (book chapters) */
  .sec-article {
    --accent: #00695c;
    --accent-strong: #004d40;
    --tint: #e0f2f1;
    --badge-bg: #b2dfdb;
  }

  .sec-conference {
    --accent: #1e5aa8;
    --accent-strong: #123d73;
    --tint: #e8f0fb;
    --badge-bg: #c9dcf5;
  }

  .sec-book {
    --accent: #c77700;
    --accent-strong: #7a4800;
    --tint: #fff4e0;
    --badge-bg: #ffe0a8;
  }

  html[data-theme="dark"] .sec-article {
    --accent: #4db6ac;
    --accent-strong: #80cbc4;
    --tint: rgba(77, 182, 172, 0.12);
    --badge-bg: rgba(77, 182, 172, 0.25);
  }

  html[data-theme="dark"] .sec-conference {
    --accent: #64a0e8;
    --accent-strong: #a9c9f2;
    --tint: rgba(100, 160, 232, 0.12);
    --badge-bg: rgba(100, 160, 232, 0.25);
  }

  html[data-theme="dark"] .sec-book {
    --accent: #f0a830;
    --accent-strong: #ffd38a;
    --tint: rgba(240, 168, 48, 0.12);
    --badge-bg: rgba(240, 168, 48, 0.25);
  }

  .sec-article .deep-teal,
  .sec-conference .deep-teal,
  .sec-book .deep-teal {
    color: var(--accent-strong);
  }

  .pub-venue {
    color: var(--global-text-color);
    opacity: 0.85;
  }

  .pub-year {
    display: inline-block;
    margin-left: 6px;
    padding: 0 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    font-style: normal;
    background-color: var(--badge-bg);
    color: var(--accent-strong);
  }

  .highlight-box {
    background-color: #d0f0eb;
    border-left: 6px solid #00695c;
    padding: 1rem 1.2rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .image-box {
    text-align: center;
    margin: 2rem 0;
  }

  .image-box img {
    max-width: 80%;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }

  .caption {
    font-size: 0.9rem;
    color: #004d40;
    margin-top: 0.5rem;
    font-style: italic;
  }

  .pub-tag {
    display: inline-block;
    margin-left: 4px;
    padding: 0 7px;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid var(--accent);
    color: var(--accent-strong);
  }

  .paper-box {
    background-color: var(--tint, #e0f2f1);
    border-left: 5px solid var(--accent, #004d40);
    color: var(--global-text-color);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  html[data-theme="dark"] .highlight-box,
  html[data-theme="dark"] .quote-box {
    background-color: rgba(77, 182, 172, 0.12) !important;
    border-left-color: #4db6ac !important;
    color: var(--global-text-color) !important;
  }

  html[data-theme="dark"] .deep-teal,
  html[data-theme="dark"] .caption {
    color: #80cbc4;
  }

  .paper-box ul,
  .paper-box ol {
    margin: 0;
    padding-left: 1.2rem;
  }

  .paper-box ol {
    padding-left: 2rem;
  }

  .paper-box ol > li::marker {
    color: var(--accent-strong);
    font-weight: 700;
  }

  .paper-box li {
    margin-bottom: 0.8rem;
    line-height: 1.7;
  }

  .pub-page a {
    color: var(--accent, #00796b);
    text-decoration: none;
  }

  .pub-page a:hover {
    text-decoration: underline;
    color: var(--accent-strong, #004d40);
  }
</style>

<div class="container mt-5 pub-page">

  <div class="highlight-box">
    <span class="deep-teal" style="font-size:1.3rem; font-weight:700;">
      Publications
    </span><br>

    <span style="color:#00796b; font-weight:500;">
      Research work and scientific contributions by
      <strong>Bikram Dholey</strong>.
    </span>
  </div>

  <hr>

  <h2 class="section-title">🎓 Featured Research Animation</h2>

  <div class="image-box">
    <img
      src="{{ '/assets/img/publication_preview/shwave-gif.gif' | relative_url }}"
      alt="Shear Horizontal Wave Propagation"
    >

    <p class="caption">
      Visualization of SH-wave propagation in layered composite structures.
    </p>
  </div>

  <hr>

  <div class="sec-article">
  <h2 class="section-title">📘 Published Research Articles</h2>

  <div class="paper-box">
    <ol>
      {% for pub in site.data.overleaf_cv.journal_articles %}
      <li>
        <strong class="deep-teal">{{ pub.title }}</strong><br>
        <em class="pub-venue">{{ pub.venue }}</em>
        {% if pub.year != "" %}<span class="pub-year">{{ pub.year }}</span>{% endif %}
        {% for tag in pub.indexing %}<span class="pub-tag">{{ tag }}</span>{% endfor %}
        {% if pub.impact_factor != "" %}<span class="pub-tag">IF: {{ pub.impact_factor }}</span>{% endif %}
        {% if pub.quartile != "" %}<span class="pub-tag">{{ pub.quartile }}</span>{% endif %}
        {% if pub.url != "" %}<br>
        <a href="{{ pub.url }}" target="_blank" rel="noopener">{% if pub.url contains "doi.org/" %}DOI: {{ pub.url | split: "doi.org/" | last }}{% else %}View Paper{% endif %}</a>
        {% endif %}
      </li>
      {% endfor %}
    </ol>
  </div>
  </div>

  <hr>

  <div class="sec-conference">
  <h2 class="section-title">🎤 Conference Proceedings</h2>

  <div class="paper-box">
    <ul>
      {% for conf in site.data.overleaf_cv.conferences %}
      <li>
        <strong class="deep-teal">{{ conf.title }}</strong><br>
        <em class="pub-venue">{{ conf.event }}</em>
        {% if conf.date != "" %}<span class="pub-year">{{ conf.date }}</span>{% endif %}
      </li>
      {% endfor %}
    </ul>
  </div>
  </div>

  <hr>

  <div class="sec-book">
  <h2 class="section-title">📚 Book Chapters</h2>

  <div class="paper-box">
    <ol>
      {% for pub in site.data.overleaf_cv.book_chapters %}
      <li>
        <strong class="deep-teal">{{ pub.title }}</strong><br>
        <em class="pub-venue">{{ pub.venue }}</em>
        {% if pub.year != "" %}<span class="pub-year">{{ pub.year }}</span>{% endif %}
        {% if pub.publisher != "" or pub.isbn != "" %}<br>
        <span class="pub-venue">{{ pub.publisher }}{% if pub.publisher != "" and pub.isbn != "" %} · {% endif %}{% if pub.isbn != "" %}ISBN {{ pub.isbn }}{% endif %}</span>
        {% endif %}
      </li>
      {% endfor %}
    </ol>
  </div>
  </div>

  <div class="quote-box"
       style="
         background-color:#e0f2f1;
         border-left:5px solid #004d40;
         padding:1rem 1.5rem;
         border-radius:8px;
         text-align:center;
         font-style:italic;
         font-size:1.05rem;
         color:#004d40;
         margin-top:2rem;
       ">

    “Waves in complex materials reveal the harmony between mathematics and physics — my research explores this deep connection.”

    <br><br>

    <span class="deep-teal">
      Bikram Dholey<br>
      Research Scholar, Department of Mathematics<br>
      Jadavpur University, Kolkata, India
    </span>

  </div>

</div>