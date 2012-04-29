"use strict";

var app = (function() {	
	var bootstrap = function() {
		Environment.collectInfo();
		LayoutManager.clean();
		LayoutManager.buildSearchPage();
	};
	
	
	
	$(document).ready(bootstrap);
	$(window).resize(bootstrap);
	

})();

