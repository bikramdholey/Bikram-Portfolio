---
banner: admin
layout: page
title: Admin
permalink: /admin/
description: Edit the website — sign in with the site owner's GitHub account.
nav: true
nav_order: 99
sitemap: false
---

{%- assign repo = "bikramdholey/bikramdholey.github.io" -%}
{%- assign cms = "https://app.pagescms.org/" | append: repo | append: "/main" -%}

<div class="admin-login">
  <a class="admin-btn" href="{{ cms }}" target="_blank" rel="noopener">🔐 Log in to the Admin panel</a>
  <p>
    Sign in with the GitHub account <strong>bikramdholey</strong> (your GitHub username and password).
    Only that account can save changes; anyone else who opens the panel can't edit anything.
  </p>
</div>

## 📷 Memories — upload photos

<ul>
  <li>
    <a class="admin-btn" href="{{ cms }}/media/memories" target="_blank" rel="noopener">Open the photo manager</a>
    — open an album folder (or create a new one) and upload pictures. Each folder is one album.
  </li>
  <li>
    Album titles are edited under
    <a href="{{ cms }}/content/memory_albums" target="_blank" rel="noopener">Memory album titles</a>.
  </li>
  <li>
    Large phone photos are shrunk automatically and iPhone HEIC photos are converted to JPG when the site is published.
  </li>
</ul>

## 📚 Publications, CV & experience

<ul>
  <li>
    <a class="admin-btn" href="https://www.overleaf.com/project/678b755bfc634d68be9d9404" target="_blank" rel="noopener">Edit the CV in Overleaf</a>
    — journal articles, book chapters, conferences, education, experience, awards, courses and references all come from the CV.
  </li>
  <li>
    The website copies the CV automatically every 3 hours. To copy it right away, use
    <strong>Sync CV &amp; publications from Overleaf now</strong> in the Admin panel's actions menu.
  </li>
</ul>

## ✏️ Text, links & pages

<ul>
  <li><a href="{{ cms }}/content/site_text" target="_blank" rel="noopener">Site text</a> — the About Me introduction, and the Publications page subtitle and quote.</li>
  <li><a href="{{ cms }}/content/socials" target="_blank" rel="noopener">Social / research profile links</a></li>
  <li><a href="{{ cms }}/content/institution_links" target="_blank" rel="noopener">Institution website links</a> (used on the About page)</li>
  <li><a href="{{ cms }}/content/teaching" target="_blank" rel="noopener">Teaching page</a> · <a href="{{ cms }}/content/contact" target="_blank" rel="noopener">Contact page</a> · <a href="{{ cms }}/content/projects" target="_blank" rel="noopener">Projects</a></li>
  <li><a href="{{ cms }}/media/images" target="_blank" rel="noopener">Other site images</a></li>
</ul>

## 🚀 Publishing

<ul>
  <li>Every save in the Admin panel publishes the website automatically within a few minutes.</li>
  <li>
    Progress and any errors:
    <a href="https://github.com/{{ repo }}/actions" target="_blank" rel="noopener">GitHub Actions</a>.
  </li>
</ul>
