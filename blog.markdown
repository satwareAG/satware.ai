---
layout: default
title: Blog
permalink: /blog/
---

<h1>Entdecke hier unsere Blogbeiträge</h1>

{% for post in site.posts %}
  <article>
    <h2 class="blog-entry-headline"><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <p>{{ post.excerpt }}</p>
    <p>Veröffentlicht am {{ post.date | date: "%d.%m.%Y" }}</p>
  </article>
{% endfor %}
