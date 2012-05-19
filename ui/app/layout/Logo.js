"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.Logo = LayoutManager.Logo || {};

(function() {
	var build = function(container) {
		container.innerText = "Scesiltium Labs - JOBOTRON!";
		$(container).css({"font-size": "45px", "color": "white"});
	};
	
	
	LayoutManager.Logo["build"] = build;
})();