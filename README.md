# Mechanical Pencil

A DIY static site generator running on [Gobble](https://github.com/gobblejs/gobble).

## Quick start

```sh
# Make sure you have the latest Node.js and npm installed

git clone [path to repo, wherever it is]
cd mechanical-pencil
npm install
npm run devel

# Visit http://localhost:4567
# Write your content
```


## Commands

```sh
# Starts the development server at http://localhost:4567
npm run devel

# Builds the static site into `public`
npm run build

# Starts the provided express server at http://localhost:8080
# or as defined by MECHANICAL_PENCIL_HOST and MECHANICAL_PENCIL_PORT env vars
npm start

# Wipes out stuff built during a build
npm run clean

# Similar to `npm run clean` but also wipes out the `node_modules` directory
npm run purge

```

## Writing Content

```
---
type: formatter
template: path/to/template.hbs
---
Summary
---
Body

```

Writing content is as simple as writing markdown with YAML front matter. The file is split into 3 sections: metadata written in YAML, the summary section and the body section. 

There's no particular directory structure to follow. The generated site will mirror the structure you create in the file system. The filename must end with a `.md` extension. There is only 1 required metadata field, `template`, which is a path relative to your content directory pointing to the template you want to use for that page.

Should you be using the optional front, listing and page transforms, the `type` metadata field is required.

## Writing templates

By default, the layout transform uses the [Handlebars Layouts](https://github.com/shannonmoeller/handlebars-layouts). The templates must reside inside your contents directory with no particular structure, with the extension of `.hb`. Data provided to the template is explained in detail in the parse transform section.


## How it works

### The concept

Essentially, your site is a function of the content you put in. Thinking this way, site generation becomes really simple and refactoring becomes a breeze.


```
let site = layout(format(parse(content)));

```

### Parse transform


This is the first transform in the tool chain. It gets all the `.md` files in the content directory, parses them into JSON and writes them to `.json` files, preserving the directory structure. The structure of the JSON is a single object comprised of the metadata, file info and content body merged in that order. 

```
{
  "title": "Hello World",
  "author": "John Doe",
  "type": "page",
  "template": ".templates/page.hbs",
  "date": "January 1, 1970",
  "tags": ["hello world", "garbage text"],
  "time": "12:00 am",
  "timestamp": 18000,
  "root": "",
  "dir": "articles\\hello-world",
  "base": "index.md",
  "ext": ".md",
  "name": "index",
  "content": "FULL MARKDOWN",
  "contentMarkup": "FULL HTML",
  "summary": "SUMMARY MARKDOWN",
  "summaryMarkup": "SUMMARY HTML",
  "body": "BODY MARKDOWN",
  "bodyMarkup": "BODY HTML"
}

```

### Layout transform

The layout transform looks for `.json` files, looks for the path of the template using the `template` property of each file, and constructs the page using that information.

The `extraData` property can be used to inject additional data into the page data for all pages. Note that `extraData` is shallow-merged and takes precedence over the page data.


### Page, listing and front transforms (optional)


The page transform is just a filter transform, only allowing pages of type "page" to be written to the output.

The listing transform looks pages of type "listing". It then attaches a `contents` property to the page data containing the page data of all pages found in the contents directory.

The front transform is similar to the listing transform. It looks for pages of type "front" and attaches a `contents` array to the page data containing page data. The difference is that you can assign how many to add.

## Extending

The transforms are no more than just custom Gobble plugins. You can refer to Gobble's API for details, particularly the [API reference](https://github.com/gobblejs/gobble/wiki/API-reference) and [Writing Plugins](https://github.com/gobblejs/gobble/wiki/Writing-plugins) sections.



## License

Copyright (c) 2016, Joseph Descalzota <fskreuz@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.