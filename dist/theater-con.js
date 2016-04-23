// theater.js
// a lightbox clone


// global variables
var newTheater;
var winWidth = 0;
var winHeight = 0;


function TheaterLightbox() {
	// get all poster elements
	this.posters = document.querySelectorAll(".theater");
	// global array to store a list of the group names
	this.groupNames = [];
	// global object to store a list of .poster elements under their respective group names
	this.groups = {};
	// global variables to store the currently selected group name
	// and number position of the current poster in the group
	this.currentPosterNum = 0;
	this.currentPosterGroup = "null";
	// current timeline markers in the modal
	this.timelineMarkers = [];


	// global media values
	this.mediaWidth = 0;
	this.mediaHeight = 0;
	// default aspect ratio for youtube videos
	this.ytWidth = 560;
	this.ytHeight = 315;

	// variables to modal elements
	this.modalWrap, this.modal, this.modalRight, this.modalLeft, this.modalClose, this.modalContent, this.modalText, this.image, this.iframe, this.timelineWrap, this.bigDot, this.smallDot;
}

TheaterLightbox.prototype.buildModal = function() {
	// wrapper for dimming background
	this.modalWrap = document.createElement("div");
	this.modalWrap.setAttribute("class", "modal-wrap theater-bg-inactive");
	// modal
	this.modal = document.createElement("div");
	this.modal.setAttribute("class", "modal theater-modal-inactive");
	this.modalWrap.appendChild(this.modal);
	// controls
	// right button
	this.modalRight = document.createElement("div");
	this.modalRight.setAttribute("id", "modal-right");
	this.modal.appendChild(this.modalRight);
	// left button
	this.modalLeft = document.createElement("div");
	this.modalLeft.setAttribute("id", "modal-left");
	this.modal.appendChild(this.modalLeft);
	// close button
	this.modalClose = document.createElement("div");
	this.modalClose.setAttribute("id", "modal-close");
	this.modal.appendChild(this.modalClose);
	// content
	this.modalContent = document.createElement("div");
	this.modalContent.setAttribute("class", "modal-content");
	this.modal.appendChild(this.modalContent);
	// text
	this.modalText = document.createElement("div");
	this.modalText.setAttribute("class", "modal-description");
	this.modal.appendChild(this.modalText);
	// media
	this.image = document.createElement("img");
	this.iframe = document.createElement("iframe");
	// timeline
	this.timelineWrap = document.createElement("div");
	this.timelineWrap.setAttribute("class", "timeline-wrap");
	this.modal.appendChild(this.timelineWrap);
	// big and small dot templates
	this.bigDot = document.createElement("div");
	this.bigDot.setAttribute("class", "dot-big");
	this.smallDot = document.createElement("div");
	this.smallDot.setAttribute("class", "dot-small");
	var body = document.querySelector("body");
	body.insertBefore(this.modalWrap, body.firstChild);
}


TheaterLightbox.prototype.setup = function() {
	var self = this; // reference for binding events

	// bind events to any element with the theater class
	for (var i=0; i<this.posters.length; i++ ) {
		// collect posters in an object, group names in a list
		var curName = this.posters[i].dataset.theaterGroup;
		var add = false;
		if (this.groupNames.length === 0) {
			this.groups[curName] = [];
			add = true;
		} else {
			for (var j=0; j<this.groupNames.length; j++) {
				if (curName === this.groupNames[j]) {
					add = false;
					break;
				}
				add = true;
			}
		}
		if (add) {
			this.groups[curName] = [];
			this.groupNames.push(curName);
		}
		this.groups[curName].push(this.posters[i]);

		// add events to poster elements
		this.posters[i].addEventListener("click", function() {
			// figure out what # poster was clicked on
			self.currentPosterGroup = this.dataset.theaterGroup;
			// self.currentPosterNum = self.groups[self.currentPosterGroup].indexOf(this);
			self.currentPosterNum = self.groups[self.currentPosterGroup].indexOf(this);

			// build modal using current poster info
			self.updateModal(self.currentPosterGroup, self.currentPosterNum, "new");
			// show the modal
			self.modalWrap.setAttribute("class", "modal-wrap theater-bg-active");
			self.modal.setAttribute("class", "modal theater-modal-active");
		});
	}

	// modal button events
	this.modalClose.onclick = function() {
		self.modalWrap.setAttribute("class", "modal-wrap theater-bg-inactive");
		self.modal.setAttribute("class", "modal theater-modal-inactive");
		// reset global current poster info
		self.currentPosterGroup = "";
		self.currentPosterNum = 0;
		// clear contents of modal
		self.clearModal();
		self.clearTimeline();
	}
	this.modalRight.onclick = function() {
		if (self.groups[self.currentPosterGroup].length>1) {
			// clear contents of modal
			self.clearModal();
			// wait 500ms, then build modal using current poster info
			setTimeout(function() {self.updateModal(self.currentPosterGroup, self.currentPosterNum, "right")}, 500);
		}
	}
	this.modalLeft.onclick = function() {
		if (self.groups[self.currentPosterGroup].length>1) {
			// clear contents of modal
			self.clearModal();
			// wait 500ms, then build modal using current poster info
			setTimeout(function() {self.updateModal(self.currentPosterGroup, self.currentPosterNum, "left")}, 500);
		}
	}
}


TheaterLightbox.prototype.updateModal = function(posterGroup, posterNum, dir) {
	var self = this; // reference for settimeout
	
	// figure out direction of modal
	// ** dir can be right, left, new, or timeline
	if (dir == "new") {
		this.currentPosterGroup = posterGroup;
		this.buildTimeline(posterGroup);
	}	else if (dir == "timeline") {
		this.updateTimeline(posterNum);
	} else if (dir == "right") {
		if (posterNum == (this.groups[posterGroup].length - 1)) {
			posterNum = 0;
		} else {
			posterNum++;
		}
		this.updateTimeline(posterNum);
	} else if (dir == "left") {
		if (posterNum == 0) {
			posterNum = (this.groups[posterGroup].length - 1);
		} else {
			posterNum--;
		}
		this.updateTimeline(posterNum);
	} else {
		console.log("error!!");
	}


	// update global current poster values
	this.currentPosterGroup = posterGroup;
	this.currentPosterNum = posterNum;
	var src = this.groups[this.currentPosterGroup][this.currentPosterNum].querySelector("img").alt;
	var txt = this.groups[this.currentPosterGroup][this.currentPosterNum].querySelector("img").title;


	// use poster info to update the modal box before showing it
	var newEl;
	var type;
	if (this.groups[this.currentPosterGroup][this.currentPosterNum].dataset.type === "img") {
		newEl = this.image.cloneNode(true);
		type = "img";
	} else if (this.groups[this.currentPosterGroup][this.currentPosterNum].dataset.type === "vid") {
		newEl = this.iframe.cloneNode(true);
		type = "vid";
	} else {
		console.log("wrong media type!");
	}
	newEl.setAttribute("src", src);
	this.modalContent.appendChild(newEl);
	// calculate maximum image size
	// use a delay to check current image size so dom can load
	setTimeout(function() {
		if (type == "img") {
			self.mediaWidth = newEl.width;
			self.mediaHeight = newEl.height;
		} else if (type == "vid") {
			self.mediaWidth = self.ytWidth;
			self.mediaHeight = self.ytHeight;
		} else {
			console.log("another wrong media type!");
		}
		self.setModalDimesions(newEl);
	}, 10);

	this.modalText.textContent = txt;
	// show modal
	this.modal.setAttribute("class", "modal theater-modal-active");
}

TheaterLightbox.prototype.setModalDimesions = function(el) {
	var imgRatio = this.mediaWidth / this.mediaHeight;

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
	this.modalContent.style.height = newHeight + "px";
	this.modalContent.style.width = newWidth + "px";
}

// function to clear modal and timeline
TheaterLightbox.prototype.clearModal = function() {
	var self = this; // reference for settimeout

	this.modal.setAttribute("class", "modal theater-modal-inactive");
	// remove media from the modalContent element
	var curImg = this.modalContent.querySelector("img") || this.modalContent.querySelector("iframe");
	if (curImg) {
    setTimeout(function() {
	    self.modalContent.removeChild(curImg);
    }, 500);
	}
}

TheaterLightbox.prototype.buildTimeline = function(posterGroup) {
	var self = this; // reference for binding events

	// get current group length, this will be the number of markers (big dots)
	var tlLength = this.groups[posterGroup].length;
	for (var i=0; i<tlLength; i++) {
		var newBigDot = this.bigDot.cloneNode(true);
		this.timelineMarkers.push(newBigDot);
		this.timelineWrap.appendChild(newBigDot);
		if (i != (tlLength-1)) {
			var smallDot1 = this.smallDot.cloneNode(true);
			var smallDot2 = this.smallDot.cloneNode(true);
			this.timelineWrap.appendChild(smallDot1);
			this.timelineWrap.appendChild(smallDot2);
		}
	}
	// calculate timelineWrap width and update element
	// dotWrap elements are 18px x 18px
	var timelineWidth = (20 * tlLength) + (20 * (tlLength-1) * 2);
	this.timelineWrap.style.width = timelineWidth + "px";
	// highlight the active timeline marker
	this.timelineMarkers[this.currentPosterNum].id = "highlight";
	// add click events to the timeline markers
	for (var j=0; j<this.timelineMarkers.length; j++) {
		this.timelineMarkers[j].addEventListener("click", function() {
			// when a timeline marker is clicked, check if it is the current marker, 
			// then update the global current poster values and build a new modal
			var thisPosterNum = self.timelineMarkers.indexOf(this);
			if (self.currentPosterNum != thisPosterNum) {
				// update styling of previous poster timeline marker
				self.timelineMarkers[self.currentPosterNum].id = "";
				// update global current poster num
				self.currentPosterNum = thisPosterNum;
				self.clearModal();
				setTimeout(function() {self.updateModal(self.currentPosterGroup, self.currentPosterNum, "timeline")}, 500);
				// update the active timeline marker
				self.timelineMarkers[self.currentPosterNum].id = "highlight";
			}
		});
	}
}

TheaterLightbox.prototype.updateTimeline = function(posterNum) {
	// remove all highlights from the timeline
	for (var i=0; i<this.timelineMarkers.length; i++) {
		this.timelineMarkers[i].id = "";
	}
	// highlight the correct timeline marker for the current poster
	this.timelineMarkers[posterNum].id = "highlight";
}

TheaterLightbox.prototype.clearTimeline = function() {
	// remove any elements currently in the timeline
	while (this.timelineWrap.firstChild) {
    this.timelineWrap.removeChild(this.timelineWrap.firstChild);
	}
	// remove any elements in the timelineMarkers array
	this.timelineMarkers = [];
}

// get the dimensions of the window
TheaterLightbox.prototype.getDimensions = function() {
	winWidth = document.documentElement.clientWidth;
	winHeight = document.documentElement.clientHeight
	var curMedia = this.modalContent.querySelector("img") || this.modalContent.querySelector("iframe");
	if (curMedia) {
		this.setModalDimesions(curMedia);
	}
}


// get current screen dimensions, update them when the window is resized
window.onload = function() {
	newTheater = new TheaterLightbox();
	newTheater.buildModal();
	newTheater.setup();
	newTheater.getDimensions();
}
window.onresize = function() {
	newTheater.getDimensions();
}
