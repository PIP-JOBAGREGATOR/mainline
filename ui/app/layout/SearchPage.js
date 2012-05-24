"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.SearchPage = LayoutManager.SearchPage || {};

(function() {
	
	var build = function(container) {
		var cvInput = document.createElement("div");
		var livePreview = document.createElement("div");

		$(cvInput).css({
			"width" : 0.5 * Environment.getWindowWidth() + "px",
			"height" : (container["height"]) + "px",
			"position" : "absolute",
			"top" : "0px",
            "background-size" : "100%"
			//"background-color" : "#eeeeee"
		});

		$(livePreview).css({
			"width" : 0.5 * Environment.getWindowWidth() + "px",
			"height" : (container["height"]) + "px",
            "background-size" : "716px",
			"position" : "absolute",
			"top" : "0px",
			"left" : 0.5 * Environment.getWindowWidth() + "px",
			"border-left": "solid 2px #333333",
			"background-color": "#eeeeee"
		});
		var cvInputAPI = LayoutManager.SearchPage.buildSearchInput(cvInput);
		var livePreviewAPI = LayoutManager.SearchPage.buildLivePreview(livePreview);

		$(container).append(cvInput);
		$(container).append(livePreview);

		return {
			"cvInputAPI" : cvInputAPI,
			"livePreviewAPI" : livePreviewAPI
		};
	};
	
	LayoutManager.SearchPage["build"] = build;
})();
