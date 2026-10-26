---
layout: default
permalink: /research/
title: Research
description: Research specialization, publications and projects.
nav: true
nav_order: 87
---


<div class="container mt-5 pub-page portfolio-page">

  <header class="post-header has-scene">
    {% include tab_banner.liquid scene="pub-hero" %}
    <h1 class="post-title">Research</h1>
    <p class="post-description">{{ site.data.site_text.publications_intro | markdownify | remove: '<p>' | remove: '</p>' | strip }}</p>
  </header>

  <h2 class="section-title">🔬 Specialization</h2>

  {% include tab_banner.liquid grid="specialization" %}

  <hr>

  <h2 class="section-title">🔗 Research Profiles</h2>

  {%- assign scholar = site.data.socials | where: "name", "Google Scholar" | first -%}
  {%- assign rgate = site.data.socials | where: "name", "ResearchGate" | first %}
  <div class="profile-buttons">
    {% if scholar %}
    <a class="profile-btn" href="{{ scholar.url }}" target="_blank" rel="noopener">
      <i class="ai ai-google-scholar" aria-hidden="true"></i>
      <span><strong>Google Scholar</strong><small>Citations &amp; h-index</small></span>
    </a>
    {% endif %}
    {% if rgate %}
    <a class="profile-btn" href="{{ rgate.url }}" target="_blank" rel="noopener">
      <i class="ai ai-researchgate" aria-hidden="true"></i>
      <span><strong>ResearchGate</strong><small>Papers &amp; full texts</small></span>
    </a>
    {% endif %}
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

  <hr>

  <div class="sec-article" id="projects">
  <h2 class="section-title">🧩 Projects</h2>

  {% assign sorted_projects = site.projects | sort: "importance" %}
  <div class="row row-cols-1 row-cols-md-3 research-projects">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  </div>

  <div class="quote-box"
       style="
         background-color:var(--tint);
         border-left:5px solid var(--accent-strong);
         padding:1rem 1.5rem;
         border-radius:8px;
         text-align:center;
         font-style:italic;
         font-size:1.05rem;
         color:var(--accent-strong);
         margin-top:2rem;
       ">

    “{{ site.data.site_text.quote }}”

    <br><br>

    <span class="deep-teal">
      {{ site.data.site_text.quote_signature | join: '<br>' }}
    </span>

  </div>

</div>