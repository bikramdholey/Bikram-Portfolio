---
banner: memories
layout: page
title: Memories
permalink: /memories/
nav: true
nav_order: 70
---

<div class="memory-grid">

{% assign base_path = '/assets/img/memories/' %}
{% assign all_files = site.static_files %}

{%- comment -%} Collect folders safely {%- endcomment -%}
{% assign folders = "" | split: "" %}

{% for file in all_files %}
  {% if file.path contains base_path %}
    {% assign parts = file.path | remove: base_path | split: '/' %}
    {% assign folder = parts[0] %}
    {% assign folders = folders | push: folder %}
  {% endif %}
{% endfor %}

{% assign folders = folders | uniq %}

{%- comment -%} Separate year folders safely {%- endcomment -%}
{% assign year_folders = "" | split: "" %}
{% assign other_folders = "" | split: "" %}

{% for folder in folders %}
  {% assign first_char = folder | slice: 0, 1 %}
  {% assign num = first_char | plus: 0 %}

  {% if num > 0 or first_char == '0' %}
    {% assign year_folders = year_folders | push: folder %}
  {% else %}
    {% assign other_folders = other_folders | push: folder %}
  {% endif %}
{% endfor %}

{% assign year_folders = year_folders | sort | reverse %}
{% assign other_folders = other_folders | sort %}
{% assign final_folders = year_folders | concat: other_folders %}

{%- comment -%} Display cards {%- endcomment -%}
{% for folder in final_folders %}

  {% assign cover = nil %}
{% assign fallback = nil %}
{% assign photo_count = 0 %}
{% assign folder_path = base_path | append: folder | append: '/' %}

{% for file in all_files %}
  {% if file.path contains folder_path %}

      {% assign ext = file.extname | downcase %}

      {% if ext == '.jpg' or ext == '.jpeg' or ext == '.png' or ext == '.gif' or ext == '.webp' %}

        {% assign photo_count = photo_count | plus: 1 %}

        {%- comment -%} PRIORITY: photo1 {%- endcomment -%}
        {% if file.name contains 'photo1' %}
          {% assign cover = file %}
        {% endif %}

        {%- comment -%} fallback first image {%- endcomment -%}
        {% if fallback == nil %}
          {% assign fallback = file %}
        {% endif %}

      {% endif %}

  {% endif %}
{% endfor %}

{% if cover == nil %}
  {% assign cover = fallback %}
{% endif %}
  {% if cover %}
  <div class="memory-card">
    <a href="{{ '/memories/' | append: folder | append: '-trip/' | relative_url }}">

      <div class="thumb">
        <img src="{{ cover.path | relative_url }}" alt="{{ folder }}" loading="lazy">
      </div>

      {% assign album = site.data.memory_albums | where: 'folder', folder | first %}
      <h2>{{ album.title | default: folder | replace: '-', ' ' }}</h2>
      <p class="memory-counts">📷 {{ photo_count }}</p>

    </a>
  </div>
  {% endif %}

{% endfor %}

</div>

<style>
.memory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.memory-card {
  text-align: center;
  transition: transform 0.2s ease-in-out;
}

.memory-card:hover {
  transform: scale(1.05);
}

.thumb {
  position: relative;
}

.memory-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.memory-card h2 {
  margin-top: 8px;
  font-size: 1.1rem;
}

.memory-counts {
  margin: 0;
  font-size: 0.85rem;
  color: var(--global-text-color-light);
}
</style>
