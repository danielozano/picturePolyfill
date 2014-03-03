/*! PicturePolyfill - Responsive Images that work today. (and mimic the proposed Picture element with span elements). Author: Andrea Verlicchi | License: MIT/GPLv2 */

(function() {

	var timerId,
		pixelRatio = window.devicePixelRatio || 1,
		options;

	function init(opt) {
		options = opt;
		parseDOM();
	}

	// Parse srcset attribute and get the proper src attribute
	function getSrcAttributeFromData(data) {
		var media, i, matchedSrc;

		for (i=0; i<data.length; i+=1) {
			media = data[i].media;
			if (!media || window.matchMedia(media).matches) {
				// Get the right source based on pixel ratio
				matchedSrc = data[i].srcset[pixelRatio-1];
			}
		}
		return matchedSrc;
	}

	function getStandardImageFromData(data) {
		var i, dataElement;

		for (i=0; i<data.length; i+=1) {
			dataElement = data[i];
			if (dataElement.standard) {
				return dataElement.srcset[0];
			}
		}
		return dataElement.srcset[0];
	}

	function getOrCreateImage(imageHolder) {
		var imageElements, imageElement;
		imageElements = imageHolder.getElementsByTagName('img');

		// If image already exist, return it
		if (imageElements.length) {
			imageElement = imageElements[0];
		}
		// Else create the image
		else {
			imageElement = document.createElement('img');
			imageElement.setAttribute('alt', imageHolder.getAttribute('data-alt'));
			imageHolder.appendChild(imageElement);
		}
		return imageElement;
	}

	function parseDOM() {

		var imageHolders = document.querySelectorAll('[data-picture]'),
			imageHolder, imageElement,
			srcAttribute, pictureData,
			i;

		// Finding all the elements with data-image
		for (i=0; i<imageHolders.length; i+=1) {

			imageHolder = imageHolders[i];
			pictureData = JSON.parse(imageHolder.getAttribute('data-picture'));

			// Take the source from the matched media, or standard media
			srcAttribute = (window.matchMedia) ?
				getSrcAttributeFromData(pictureData) : 
				getStandardImageFromData(pictureData);

			// Fallback
			srcAttribute = srcAttribute || options.fallbackSrc;

			// Select the image, or create it
			imageElement = getOrCreateImage(imageHolder);

			// Set the img source
			imageElement.setAttribute('src', srcAttribute);
		}
	}

	// On resize
	if (window.addEventListener) {
		window.addEventListener('resize', function() {
			clearTimeout(timerId);
			timerId = setTimeout(function() {
				parseDOM();
			}, 50);
		});
	}

	window.picturePolyfill = init;

}());

// Execute the function right at page landing
window.picturePolyfill();