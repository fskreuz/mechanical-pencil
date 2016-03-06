{{#extend ".templates/index.hb"}}

  {{#content "pageTitle"}}{{title}}{{/content}}

  {{#content "contents"}}

    <div>{{{ contentMarkup }}}</div>

    {{#contents}}

      <div>
        <div><time>{{ date }}</time></div>
        <h3><a href="/{{ dir }}">{{ title }}</a></h3>
        <div>{{{ summaryMarkup }}}</div>
      </div>
      <div>
        <div>
          <a href="/{{ dir }}">Read more</a>
        </div>
        <div>
          {{#tags}} <span>{{this}}</span> {{/tags}}
        </div>
      </div>

      <hr>

    {{/contents}}

    <div>
      <a href="/articles">View All Articles</a>
    </div>

  {{/content}}

{{/extend}}
