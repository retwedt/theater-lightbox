# Theater - a Lightbox Clone

Welcome to Theater, a lightbox clone.


## How To Use

Include the stylesheet on your document's `<head>`.

```
<head>
  <link rel="stylesheet" href="theater.css">
</head>
```

- Attach the 'theater' class to a div to activate the lightbox
- Include an image element inside the div, this image is the thumbnail.  Set the `alt` attribute to the url of the image.  Set the `title` attribute to the description of the image.
- Use `data-theater-group='group-name'` to group the images
- Use `data-theater-type='type'` to set the type of modal being displayed, can be `'img'`, `'vid'`, or `'youTube'`


## Example:

```
<!-- these images are in the same group -->
<div class="theater" data-theater-group="test-1" data-theater-type="img" >
	<img src="img/thumbs/desk_thumb.jpg" alt="img/desk.jpg" title="Picanha filet mignon" />
</div>
<div class="theater" data-theater-group="test-1" data-theater-type="img" >
	<img src="img/thumbs/suits_thumb.jpg" alt="img/suits.jpg" title="Beefsteak hamburger link-sausage" />
</div>
```

[Live Demo](http://rextwedt.com/theater-lightbox/)


## Custom Builds

Theater-Lightbox is powered by gulp.js, and you can create custom builds pretty easily. First of all, you’ll need Gulp and all other dependencies:

```
$ cd path/to/yourProject/
$ sudo npm install
```


## Directory Structure

```
├── css/
├── demo/
     └── css/
├── dist/
     └── img/
├── docs/
     └── gen/
├── src/
     ├── img/
     ├── js/
     └── scss/
├── .gitignore
├── gulpfile.js
├── package.json
├── bower.json
└── README.md
```


## License

Theater-Lightbox is licensed under the [MIT license](https://github.com/retwedt/theater-lightbox/blob/master/LICENSE.txt).
