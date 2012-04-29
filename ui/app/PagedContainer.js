"use strict";

var PagedContainer = function(container) {
	this.container = container;
	this.container.pagedContainer = this;
	
	this.currentPage = 0;
	this.height = parseInt($(container).css("height"));
	this.width = parseInt($(container).css("width"));
	this.pages = document.createElement("div");
	this.scrollBar = document.createElement("div");
	
	// Prepare container
	$(container).css("overflow", "hidden");
	
	// Prepare the pages holder
	$(this.pages).css({
		"width": (this.width - 15) + "px",
		"height": "0px",
		"position": "relative",
		"-webkit-transition": "top 0.5s",
		"-moz-transition": "top 0.5s",
		"float": "left"
	});
	
	// Prepare the scrollBar bar
	$(this.scrollBar).css({
		"width": "15px",
		"height": (this.height - 3) + "px",
		"left": (this.width - 20) + "px"
	});
	$(this.scrollBar).slider({
		"animate": true,
		"orientation": "vertical",
		"value": 95,
		"change": function(event, ui) {
			var sliderElement = ui.handle.parentElement;
			var containerElement = sliderElement.parentElement;
			var numberOfPages = containerElement.pagedContainer.pages.childNodes.length;
			var pageSize = 100 / numberOfPages;
			var pageNumber = 1;
			var value = ui.value;
			
			while (pageNumber*pageSize < value) {
				++pageNumber;
			}
			
			pageNumber = numberOfPages - pageNumber;
			
			containerElement.pagedContainer.goToPage(pageNumber);
			
			//TODO Make the ruller snap to the middle of the interval of the current page
//			var newValue = Math.round(pageNumber * pageSize + pageSize / 2);
//			if (Math.abs(ui.value - newValue) > 5)
//				$(this.scrollBar).slider("option", "value", newValue + "px");
		},
		"slide": function(event, ui) {
			var sliderElement = ui.handle.parentElement;
			var containerElement = sliderElement.parentElement;
			var numberOfPages = containerElement.pagedContainer.pages.childNodes.length;
			var sizeOfAllPages = numberOfPages * containerElement.pagedContainer.height;
			var value = ui.value;
			
			$(containerElement.pagedContainer.pages).css("top", (-1*Math.round((100 - value)*sizeOfAllPages/100)) + "px");
			
		}
	});
	
	var clear = document.createElement("div");
	$(clear).css("clear", "both");
	
	
	// Add elements to container
	$(container).append(this.pages);
	$(container).append(this.scrollBar);
	$(container).append(clear);

};

PagedContainer.prototype.constructor = PagedContainer;

PagedContainer.prototype.goToPage = function(pageNumber) {
	this.currentPage = pageNumber;
	$(this.pages).css("top", (-1 * pageNumber * this.height) + "px");
	
	
	//var numberOfPages = this.pages.childNodes.length;
	//var pageInterval = 100 / numberOfPages;

	//$(this.scrollBar).slider("option", "value", Math.round(pageNumber * pageInterval + pageInterval / 2) + "px");
};

PagedContainer.prototype.nextPage = function() {
	if (this.currentPage + 1 < this.pages.childNodes.length) {
		this.goToPage(this.currentPage + 1);
	}
	else {
		window.console.warn("PagedContainer tried to go past the last page.");
	}
};

PagedContainer.prototype.previousPage = function() {
	if (this.currentPage > 0 ) {
		this.goToPage(this.currentPage - 1);
	}
	else {
		window.console.warn("PagedContainer tried to go past the first page.");
	}
};

PagedContainer.prototype.addPage = function(page) {
	var preparedPage = document.createElement("div");
	$(preparedPage).css({
		"width": this.width + "px",
		"height": this.height + "px",
		"overflow": "hidden"
	});
	
	$(preparedPage).append(page);
	$(this.pages).css("height", "+=" + this.height + "px");
	$(this.pages).append(preparedPage);
	
	//this.goToPage(0);
};
