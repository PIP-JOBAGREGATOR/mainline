"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.SearchPage = LayoutManager.SearchPage || {};

(function() {
	
	var build = function() {
		var cvInput = document.createElement("div");
		var livePreview = document.createElement("div");
		var logo = document.createElement("div");

		logo["logoHeight"] = 75;

		$(cvInput).css({
			"width" : 0.5 * Environment.getWindowWidth() + "px",
			"height" : (Environment.getWindowHeight() - logo.logoHeight) + "px",
			"position" : "absolute",
			"top" : logo.logoHeight + "px",
			"background-color" : "#eeeeee"
		});

		$(livePreview).css({
			"width" : 0.5 * Environment.getWindowWidth() + "px",
			"height" : (Environment.getWindowHeight() - logo.logoHeight) + "px",
			"position" : "absolute",
			"top" : logo.logoHeight + "px",
			"left" : 0.5 * Environment.getWindowWidth() + "px",
			"border-left": "solid 2px #333333",
			"background-color": "#eeeeee"
		});

		$(logo).css({
			"width" : Environment.getWindowWidth() + "px",
			"height" : logo.logoHeight + "px",
			"position" : "absolute",
			"background-color" : "#133783",
			"border-bottom": "solid 2px black"
		});

		var cvInputAPI = LayoutManager.SearchPage.buildSearchInput(cvInput);
		var livePreviewAPI = LayoutManager.SearchPage.buildLivePreview(livePreview);
		LayoutManager.Logo.build(logo);

		$(document.body).append(cvInput);
		$(document.body).append(livePreview);
		$(document.body).append(logo);

		return {
			"cvInputAPI" : cvInputAPI,
			"livePreviewAPI" : livePreviewAPI
		};
	};
	
	LayoutManager.SearchPage["build"] = build;
})();