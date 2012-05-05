"use strict";

var app = (function() {	
	var hostname = window.location.hostname;
	if (hostname.length == 0) {
		hostname = "http://localhost";
	}
	var apiURL = hostname + "/api/";
	
	var pageAPI = null;
	
	var bootstrap = function() {
		Environment.collectInfo();
		LayoutManager.clean();
		pageAPI = LayoutManager.buildPrefPage();
		
		var buildQueryJSON = function(data, offset) {
			return JSON.stringify({
				"offset": offset,
				"size": 30,
				"queryString": data.searchBar,
				"cv": data.cv || "null"
			});
		};
		
		
		var searchCallback = function() {
			var json = buildQueryJSON(pageAPI.cvInputAPI.getData(), 0);
			window.console.log(json);
			
			$.ajax({
				"url": "http://localhost/mock.json"/*apiURL + "search"*/,
				"async": true,
				"type": "get",
				"data": {"content": json},
				"success": function (data, textStatus, jqXHR) {
					window.console.log("Din ajax : " + JSON.stringify(data));
					pageAPI.livePreviewAPI.update(data);
				},
				"error": function(jqXHR, textStatus, errorThrown) {
					window.console.log("A crapat : " + errorThrown);
				}
			});
		};
		
		
		
		
		pageAPI.cvInputAPI.addSearchCallback(searchCallback);
		
	};
	
	
	
	$(document).ready(bootstrap);
	$(window).resize(bootstrap);
	

})();

