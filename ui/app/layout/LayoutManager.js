"use strict";

var LayoutManager = (function() {
	
	/**
	 * Builds the whole cvInput and appends it to the container given as parameter
	 */
	var buildCvInput = function(container) {
		//Create variables
		var containerWidth = parseInt($(container).css("width"));
		var containerHeight = parseInt($(container).css("height"));
		
		var searchBar = document.createElement("div");
		var searchButton = document.createElement("div");
		var searchInput = document.createElement("input");
		
		//Set global properties to elements
		searchBar["searchBarHeight"] = 45;
		searchBar["searchBarWidth"] = containerWidth - 20;
		
		
		//add css
		$(searchBar).css({
			"width": searchBar.searchBarWidth + "px",
			"height": searchBar.searchBarHeight + "px"
		});
		$(searchBar).addClass("ui-widget-content ui-corner-all");
		
		
		$(searchButton).css({
			"width": (Math.round(searchBar.searchBarWidth * 0.2) - 5) + "px",
			"height": (searchBar.searchBarHeight - 3) + "px",
			"float": "right"
		});
		
		
		$(searchInput).css({
			"width": (Math.round(searchBar.searchBarWidth * 0.8) - 5) + "px",
			"height": searchBar.searchBarHeight + "px",
			"border": "0px",
			"float": "left",
			"font-size": "20px"
		});
		$(searchInput).addClass("ui-widget-content");
		
		
		//Setup jqueryui components
		$(searchButton).button({
			"label": "Cauta job"
		});
		
		$(searchButton).click(function() {
			
			
			
			window.console.log("am dat click pe search acum");
			return false;
		});
		
		
		//searchInput.setAttribute("type", "text");
		
		// Add elements to DOM
		$(searchBar).append(searchInput);
		$(searchBar).append(searchButton);
		$(container).append(searchBar);
	};
	
	var buildSearchPage = function() {
		var cvInput = document.createElement("div");
		var livePreview = document.createElement("div");
		
		$(cvInput).css({
			"width": 0.4*Environment.getWindowWidth() + "px",
			"height": Environment.getWindowHeight() + "px",
			"position": "absolute",
			"background-color": "red"
		});
		
		$(livePreview).css({
			"width": 0.6*Environment.getWindowWidth() + "px",
			"height": Environment.getWindowHeight() + "px",
			"position": "absolute",
			"left": 0.4*Environment.getWindowWidth() + "px",
			"background-color": "blue"
		});
		
		
		buildCvInput(cvInput);
		
		$(document.body).append(cvInput);
		$(document.body).append(livePreview);
		
		
		
		
		
		
		
		/*var container = document.createElement("div");
		$(container).css({
			"width": "300px",
			"height": "30px"
		});
		
		
		$(container).addClass("ui-widget-content ui-corner-all");
		//$(container).addClass("ui-autocomplete-input");
		
		$(livePreview).append(container);*/
		
		
		
		/*var container = document.createElement("div");
		$(container).css("width", "400px");
		$(container).css("height", "600px");
		$(container).css("border", "solid 1px");
		
		$(livePreview).append(container);
		
		var paged = new PagedContainer(container);
		
		
		var colors = ["green", "yellow", "pink", "orange", "white"];
		for (var i = 0; i < 5; ++i) {
			var page = document.createElement("div");
			$(page).css({
				"background-color": colors[i],
				"height": "600px"
				});
			page.innerText = "page" + i;
			paged.addPage(page);
		}*/
		
	};
	
	var clean = function() {
		var children = document.body.childNodes;
		
		for (var i = children.length - 1; i >= 0; --i) {
			document.body.removeChild(children[i]);
		}
	};
	
	return {
		buildSearchPage: buildSearchPage,
		clean: clean
	};
})();