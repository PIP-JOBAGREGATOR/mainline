"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.Logo = LayoutManager.Logo || {};

(function() {
	var build = function(container) {	
		container.innerHTML = "Scesiltium Labs - JOBOTRON!";	
	};
	
	
	LayoutManager.Logo["build"] = build;
})();
