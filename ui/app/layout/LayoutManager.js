"use strict";

var LayoutManager = LayoutManager || {};

(function() {
	
	/* This build the whole user interface */
	var buildUI = function() {
		return LayoutManager.SearchPage.build();
	};
	


	var clean = function() {
		var children = document.body.childNodes;

		for ( var i = children.length - 1; i >= 0; --i) {
			document.body.removeChild(children[i]);
		}
	};

	LayoutManager["buildUI"] = buildUI;
	LayoutManager["clean"] = clean;
})();