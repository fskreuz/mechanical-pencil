<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>{{ site.name }} - {{#block "pageTitle"}}{{/block}}</title>
    {{#block "styles"}}{{/block}}
  </head>
  <body>
    <nav>
      {{#site.links}}
      <a href="{{ url }}" title="{{ name }}">{{ name }}</a>
      {{/site.links}}
    </nav>
    <section>
      {{#block "contents"}}{{/block}}
    <section>
    <footer>
      <p>&copy; <script>document.write(new Date().getFullYear())</script> <a href="mailto:{{ site.email }}">{{ site.owner }}</a></p>
    </footer>
    {{#block "scripts"}}{{/block}}
  </body>
</html>
