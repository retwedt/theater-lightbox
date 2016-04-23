// theater.js
// a lightbox clone


// wrapper for dimming background
var modalWrap = document.createElement("div");
modalWrap.setAttribute("class", "modal-wrap theater-bg-inactive");
// modal
var modal = document.createElement("div");
modal.setAttribute("class", "modal theater-modal-inactive");
modalWrap.appendChild(modal);
// controls
// right button
var modalRight = document.createElement("div");
modalRight.setAttribute("id", "modal-right");
modal.appendChild(modalRight);
// left button
var modalLeft = document.createElement("div");
modalLeft.setAttribute("id", "modal-left");
modal.appendChild(modalLeft);
// close button
var modalClose = document.createElement("div");
modalClose.setAttribute("id", "modal-close");
modal.appendChild(modalClose);
// content
var modalContent = document.createElement("div");
modalContent.setAttribute("class", "modal-content");
modal.appendChild(modalContent);
// text
var modalText = document.createElement("div");
modalText.setAttribute("class", "modal-description");
modal.appendChild(modalText);
// media
var image = document.createElement("img");
var iframe = document.createElement("iframe");
// timeline
var timelineWrap = document.createElement("div");
timelineWrap.setAttribute("class", "timeline-wrap");
modal.appendChild(timelineWrap);
// big and small dot templates
var bigDot = document.createElement("div");
bigDot.setAttribute("class", "dot-big");
var smallDot = document.createElement("div");
smallDot.setAttribute("class", "dot-small");
var body = document.querySelector("body");
body.insertBefore(modalWrap, body.firstChild);


// DOM ELEMENTS
// get all poster elements
var posters = document.querySelectorAll(".theater");
// global array to store a list of the group names
var groupNames = [];
// global object to store a list of .poster elements under their respective group names
var groups = {};
// global variables to store the currently selected group name
// and number position of the current poster in the group
var currentPosterNum = 0;
var currentPosterGroup = "null";
// current timeline markers in the modal
var timelineMarkers = [];


// get current screen dimensions, update them when the window is resized
var winWidth = 0;
var winHeight = 0;
// global media values
var mediaWidth = 0;
var mediaHeight = 0;
// default aspect ratio for youtube videos
var ytWidth = 560;
var ytHeight = 315;
window.onload = getDimensions;
window.onresize = getDimensions;


// EVENTS
for (var i=0; i<posters.length; i++ ) {
	// collect posters in an object, group names in a list
	var curName = posters[i].dataset.theaterGroup;
	var add = false;
	if (groupNames.length === 0) {
		groups[curName] = [];
		add = true;
	} else {
		for (var j=0; j<groupNames.length; j++) {
			if (curName === groupNames[j]) {
				add = false;
				break;
			}
			add = true;
		}
	}
	if (add) {
		groups[curName] = [];
		groupNames.push(curName);
	}
	groups[curName].push(posters[i]);

	// add events to poster elements
	posters[i].addEventListener("click", function() {
		// figure out what # poster was clicked on
		currentPosterGroup = this.dataset.theaterGroup;
		currentPosterNum = groups[currentPosterGroup].indexOf(this);

		// build modal using current poster info
		updateModal(currentPosterGroup, currentPosterNum, "new");
		// show the modal
		modalWrap.setAttribute("class", "modal-wrap theater-bg-active");
		modal.setAttribute("class", "modal theater-modal-active");
	});
}


// modal button events
modalClose.onclick = function() {
	modalWrap.setAttribute("class", "modal-wrap theater-bg-inactive");
	modal.setAttribute("class", "modal theater-modal-inactive");
	// reset global current poster info
	currentPosterGroup = "";
	currentPosterNum = 0;
	// clear contents of modal
	clearModal();
	clearTimeline();
}
modalRight.onclick = function() {
	if (groups[currentPosterGroup].length>1) {
		// clear contents of modal
		clearModal();
		// wait 500ms, then build modal using current poster info
		setTimeout(function() {updateModal(currentPosterGroup, currentPosterNum, "right")}, 500);
	}
}
modalLeft.onclick = function() {
	if (groups[currentPosterGroup].length>1) {
		// clear contents of modal
		clearModal();
		// wait 500ms, then build modal using current poster info
		setTimeout(function() {updateModal(currentPosterGroup, currentPosterNum, "left")}, 500);
	}
}


// FUNCTIONS
function updateModal(posterGroup, posterNum, direction) {
	// figure out direction of modal
// ** direction can be right, left, new, or timeline
	if (direction == "new") {
		buildTimeline(posterGroup);
	}	else if (direction == "timeline") {
		updateTimeline(posterNum);
	} else if (direction == "right") {
		if (posterNum == (groups[posterGroup].length - 1)) {
			posterNum = 0;
		} else {
			posterNum++;
		}
		updateTimeline(posterNum);
	} else if (direction == "left") {
		if (posterNum == 0) {
			posterNum = (groups[posterGroup].length - 1);
		} else {
			posterNum--;
		}
		updateTimeline(posterNum);
	} else {
		console.log("error!!");
	}


	// update global current poster values
	currentPosterGroup = posterGroup;
	currentPosterNum = posterNum;
	var src = groups[currentPosterGroup][currentPosterNum].querySelector("img").alt;
	var txt = groups[currentPosterGroup][currentPosterNum].querySelector("img").title;


	// use poster info to update the modal box before showing it
	var newEl;
	var type;
	if (groups[currentPosterGroup][currentPosterNum].dataset.type === "img") {
		newEl = image.cloneNode(true);
		type = "img";
	} else if (groups[currentPosterGroup][currentPosterNum].dataset.type === "vid") {
		newEl = iframe.cloneNode(true);
		type = "vid";
	} else {
		console.log("wrong media type!");
	}
	newEl.setAttribute("src", src);
	modalContent.appendChild(newEl);
	// calculate maximum image size
	// use a delay to check current image size so dom can load
	setTimeout(function() {
		if (type == "img") {
			mediaWidth = newEl.width;
			mediaHeight = newEl.height;
		} else if (type == "vid") {
			mediaWidth = ytWidth;
			mediaHeight = ytHeight;
		} else {
			console.log("another wrong media type!");
		}
		setModalDimesions(newEl);
	}, 10);

	modalText.textContent = txt;
	// show modal
	modal.setAttribute("class", "modal theater-modal-active");
}
function setModalDimesions(el) {
	var imgRatio = mediaWidth / mediaHeight;

	// calculate width based on height
	var newHeight = (winHeight * 0.9) - 80;
	var newWidth = newHeight * imgRatio;

	// if the width is wider than the screen, calculate ratio based on width instead
	if ((newWidth+48) >= winWidth) {
		newWidth = (winWidth * 0.9);
		newHeight = newWidth * (1/imgRatio);
	}

	// set new height and width of image and modalContent
	el.style.height = newHeight + "px";
	el.style.width = newWidth + "px";
	modalContent.style.height = newHeight + "px";
	modalContent.style.width = newWidth + "px";
}
// function to clear modal and timeline
function clearModal() {
	modal.setAttribute("class", "modal theater-modal-inactive");
	// remove media from the modalContent element
	var curImg = modalContent.querySelector("img") || modalContent.querySelector("iframe");
	if (curImg) {
    setTimeout(function() {
	    modalContent.removeChild(curImg);
    }, 500);
	}
}
function buildTimeline(posterGroup) {
	// get current group length, this will be the number of markers (big dots)
	tlLength = groups[posterGroup].length;
	for (var i=0; i<tlLength; i++) {
		var newBigDot = bigDot.cloneNode(true);
		timelineMarkers.push(newBigDot);
		timelineWrap.appendChild(newBigDot);
		if (i != (tlLength-1)) {
			var smallDot1 = smallDot.cloneNode(true);
			var smallDot2 = smallDot.cloneNode(true);
			timelineWrap.appendChild(smallDot1);
			timelineWrap.appendChild(smallDot2);
		}
	}
	// calculate timelineWrap width and update element
	// dotWrap elements are 18px x 18px
	var timelineWidth = (20 * tlLength) + (20 * (tlLength-1) * 2);
	timelineWrap.style.width = timelineWidth + "px";
	// highlight the active timeline marker
	timelineMarkers[currentPosterNum].id = "highlight";
	// add click events to the timeline markers
	for (var j=0; j<timelineMarkers.length; j++) {
		timelineMarkers[j].addEventListener("click", function() {
			// when a timeline marker is clicked, check if it is the current marker, 
			// then update the global current poster values and build a new modal
			var thisPosterNum = timelineMarkers.indexOf(this);
			if (currentPosterNum != thisPosterNum) {
				// update styling of previous poster timeline marker
				timelineMarkers[currentPosterNum].id = "";
				// update global current poster num
				currentPosterNum = thisPosterNum;
				clearModal();
				setTimeout(function() {updateModal(currentPosterGroup, currentPosterNum, "timeline")}, 500);
				// update the active timeline marker
				timelineMarkers[currentPosterNum].id = "highlight";
			}
		});
	}
}
function updateTimeline(posterNum) {
	// remove all highlights from the timeline
	for (var i=0; i<timelineMarkers.length; i++) {
		timelineMarkers[i].id = "";
	}
	// highlight the correct timeline marker for the current poster
	timelineMarkers[posterNum].id = "highlight";
}
function clearTimeline() {
	// remove any elements currently in the timeline
	while (timelineWrap.firstChild) {
    timelineWrap.removeChild(timelineWrap.firstChild);
	}
	// remove any elements in the timelineMarkers array
	timelineMarkers = [];
}

// get the dimensions of the window
function getDimensions() {
	winWidth = document.documentElement.clientWidth;
	winHeight = document.documentElement.clientHeight
	var curMedia = modalContent.querySelector("img") || modalContent.querySelector("iframe");
	if (curMedia) {
		setModalDimesions(curMedia);
	}
}
