"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.Menu = LayoutManager.Menu || {};

(function() {

	var loadSearch = function(main) {
		
		main.style.left = "0px";
		
	}
	var loadPrefs = function(main) {
		main.style.left = ((-1) * Environment.getWindowWidth() ) + "px";
		
	}

	var buildButtons = function(searchButton,prefsButton,mainDiv){
		
		var topSearch = document.createElement("div");
		var topPrefs = document.createElement("div");
		var textSearch = document.createElement("div");
		var textPrefs = document.createElement("div");

		$(searchButton).click(function() {
            loadSearch(mainDiv);
            $(topPrefs).css({
              "background-color" : "rgb(170,170,170)"
            });
            $(topSearch).css({
              "background-color" : "rgb(113,113,113)"
            });
        });
		$(prefsButton).click(function() {
          loadPrefs(mainDiv);
          $(topSearch).css({
            "background-color" : "rgb(170,170,170)"
          });
          $(topPrefs).css({
            "background-color" : "rgb(113,113,113)"
          });
        });
	
		textSearch.innerHTML = "Cautare";
		textPrefs.innerHTML = "Preferinte";

		$(topSearch).css({
			"width" : searchButton.searchHeight+"px",
			"height" : "7px",
			"position" : "absolute",
			"background-color" : "rgb(113,113,113)"
		});
		$(topPrefs).css({
			"width" : prefsButton.prefsHeight+"px",
			"height" : "7px",
			"position" : "absolute",
			"background-color" : "rgb(170,170,170)"
		});
		$(textSearch).css({
			"width" : searchButton.searchHeight+"px",
			"height" : "20px",
			"position" : "absolute",
			"top" : "9px",
            "color" : "rgb(43,12,12)"
		});
		$(textPrefs).css({
			"width" : prefsButton.prefsHeight+"px",
			"height" : "20px",
			"position" : "absolute",
			"top" : "9px",
            "color" : "rgb(43,12,12)"
		});
		
		$(searchButton).append(topSearch);
		$(prefsButton).append(topPrefs);
		$(searchButton).append(textSearch);
		$(prefsButton).append(textPrefs);

	}

	var build = function(container,mainDiv) {
		
		var search = document.createElement("div");
		var prefs = document.createElement("div");
		search["searchHeight"] = 100;
		prefs["prefsHeight"] = 100;

		buildButtons(search,prefs,mainDiv);

		$(search).css({
			"width" : search.searchHeight+"px",
			"height" : "30px",
			"position" : "absolute",
			"top" : "5px",
			"left" : ( 0.5 * Environment.getWindowWidth() - 120 ) + "px",
		});
		$(prefs).css({
			"width" : prefs.prefsHeight+"px",
			"height" : "30px",
			"position" : "absolute",
			"top" : "5px",
			"left" : ( 0.5 * Environment.getWindowWidth() + 20 ) + "px",
		});

				
		$(container).append(search);
		$(container).append(prefs);
	};
	
	
	LayoutManager.Menu["build"] = build;
})();
