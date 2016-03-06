{{#extend ".templates/index.hb"}}

  {{#content "pageTitle"}}{{title}}{{/content}}

  {{#content "contents"}}

    <div><time>{{ date }}</time></div>
    <h1>{{ title }}</h1>
    <div>{{{ contentMarkup }}}</div>
    <div>
      {{#tags}} <span>{{this}}</span> {{/tags}}
    </div>
    <hr>
    <div>
      <a href="/articles">View All Articles</a>
    </div>

  {{/content}}

{{/extend}}
