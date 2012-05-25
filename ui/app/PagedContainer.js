"use strict";

var PagedContainer = function(container) {
	this.container = container;
	this.container.pagedContainer = this;
	this.pages = document.createElement("div");
	this.scrollBar = document.createElement("div");
	
	this.updateParameters();
	
	// Prepare container
	$(container).css("overflow", "hidden");
	
	// Prepare the pages holder
	$(this.pages).css({
		"width": (this.parameters.containerWidth - 15) + "px",
		"height": "0px",
		"position": "relative",
		"-webkit-transition": "top 0.5s",
		"-moz-transition": "top 0.5s",
		"float": "left"
	});
	
	// Prepare the scrollBar bar
	$(this.scrollBar).css({
		"width": "15px",
		"height": (this.parameters.containerHeight - 3) + "px",
		"left": (this.parameters.containerWidth - 20) + "px"
	});
	$(this.scrollBar).slider({
		"animate": true,
		"orientation": "vertical",
		"value": 95,
		"stop": function(event, ui) {
			//var sliderElement = ui.handle.parentElement;
			//var containerElement = sliderElement.parentElement;
			//var pagedContainer = containerElement.pagedContainer;
			
			//var pageNumber = 1;
			//var value = ui.value;
			
			//while (pageNumber * pagedContainer.parameters.pageLength < value) {
			//	++pageNumber;
			//}
			//pageNumber = pagedContainer.parameters.numberOfPages - pageNumber;
			
			//Tell the container that the current page must be changed
			//pagedContainer.goToPage(pageNumber);
			
			
			
			//TODO Make the ruller snap to the middle of the interval of the current page
			//var newValue = Math.round((pageNumber + 0.5) * pageSize);
//			if (Math.abs(ui.value - newValue) > 5  || true) {
//				sliderElement["onlyMoveTheSlider"] = true;
//				window.console.log("about to set the value. Old was " + value + " New value is " + newValue);
//				$(this.scrollBar).slider("value", newValue);
//			}
		},
		"slide": function(event, ui) {
			
			var sliderElement = ui.handle.parentElement;
			var containerElement = sliderElement.parentElement;
			var pagedContainer = containerElement.pagedContainer;
			var value = ui.value;
			
			var newCssTop = (-1*Math.round((100 - value)*pagedContainer.parameters.allPagesHeight/100));
			
			$(containerElement.pagedContainer.pages).css("top",newCssTop + "px");
			
			window.console.log("slide : " + ui.value);
		},
		"change": function(event,ui) {
			window.console.log("change la : " + ui.value);
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

PagedContainer.prototype.updateParameters = function() {
	if (this.hasOwnProperty("parameters") == false) {
		// Must initiate the parameters object
		var parameters = new Object();
		parameters["currentPage"] = 0;
		parameters["numberOfPages"] = 0;
		parameters["containerHeight"] = parseInt($(this.container).css("height"));
		parameters["containerWidth"] = parseInt($(this.container).css("width"));
		this["parameters"] = parameters;
		this.parameters["allPagesHeight"] = 0;
	}
	else {
		this.parameters["numberOfPages"] = this.pages.childNodes.length;
		this.parameters["pageLength"] = 100 / this.parameters["numberOfPages"];
		
		var middleOfPages = new Array();
		for (var i = 0; i < this.parameters["numberOfPages"]; ++i) {
			middleOfPages.push((i + 0.5) * this.parameters["pageLength"]);
		}
		
		this.parameters["middleOfPages"] = middleOfPages;
		this.parameters["allPagesHeight"] = this.parameters["containerHeight"]*this.parameters["numberOfPages"];
	}
};

PagedContainer.prototype.goToPage = function(pageNumber) {
	this.parameters["currentPage"] = pageNumber;
	$(this.pages).css("top", (-1 * pageNumber * this.parameters.containerHeight) + "px");
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
		"width": this.parameters.containerWidth + "px",
		//"height": this.parameters.containerHeight + "px",
		//"overflow": "hidden"
        "height": "auto"
	});
	
	$(preparedPage).append(page);
	$(this.pages).css("height", "+=" + this.parameters.containerHeight + "px");
	$(this.pages).append(preparedPage);
	
	this.updateParameters();
	
};

PagedContainer.prototype.setValue = function(value) {
  $(this.scrollBar).slider("value", value);
};
