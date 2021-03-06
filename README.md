# Theater - a Lightbox Clone

Welcome to Theater, a lightbox clone.


## How To Use

Include the stylesheet on your document's `<head>`.
```
<head>
  <link href="theater.css" rel="stylesheet">
</head>
```

Include the javascript file in your document's `<body>`, just before the closing tag.
```
<body>
	// other code here
  <script src="theater.min.js"></script>
</body>
```

- Attach the `theater` class to a div to activate the lightbox
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

Theater-Lightbox is powered by gulp.js, so it's pretty easy to create a custom build. First you will need a copy of the Theater-Lightbox project.  Next, you will need Gulp and all other dependencies:

```
$ cd path/to/theaterLightbox/
$ npm install // you will need sudo if you are on a mac!
```

Run `gulp` to compile your custom builds.  You can customize the look of your lightbox using `src/scss/_custom-variables.scss`.

There are three variables you can customize:
```
// $wrap-bg-color: #EDD2D2;
// $modal-bg-color: #C14343;
// $btn-prefix: red;
```
`$wrap-bg-color` describes the color the background fades to when the modal is active.  `$modal-bg-color` describes the color of the modal box.  `$btn-prefix` can be used to allow custom buttons.  This example will allow you to use custom buttons called `red-left.png`, `red-right.png`, and `red-close.png`.


## Directory Structure

```
├── dist/
     └── img/
├── docs/
├── src/
		 ├── demo/
		      ├── img/
		      └── css/
     ├── img/
     ├── js/
     └── scss/
├── .gitignore
├── gulpfile.js
├── bower.json
├── package.json
├── CHANGELOG.md
├── LICENSE.txt
└── README.md
```


## License

Theater-Lightbox is licensed under the [MIT license](https://github.com/retwedt/theater-lightbox/blob/master/LICENSE.txt).
