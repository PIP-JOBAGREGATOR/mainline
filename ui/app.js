"use strict";

var app = (function() {	
	var hostname = window.location.hostname;
	if (hostname.length == 0) {
		hostname = "https://192.168.0.114:8443";
	}
	var apiURL = hostname + "/api/";
	
	var pageAPI = null;
	
	var bootstrap = function() {
		Environment.collectInfo();
		LayoutManager.clean();
		pageAPI = LayoutManager.buildUI();
		
		var buildQueryJSON = function(data, offset) {
			return JSON.stringify({
				"offset": offset,
				"size": 30,
				"queryString": data.searchBar,
				"cv": data.cv
			});
		};
	        var saveCV = function(){
	                var jsonOb = pageAPI.cvInputAPI.saveCV();
       	        	var json = buildQueryJSON(jsonOb, 0);
                	$.ajax({
                	"url": "https://192.168.1.105:8443/api/cv/set/",
                	"async": true,
                	"type": "post",
                	"data": {"content": json},
                	"success": function (data, textStatus, jqXHR) {
                        	window.console.log("OK");
                	},
                	"error": function(jqXHR, textStatus, errorThrown) {
                        	window.console.log("A crapat : " + errorThrown);
                		}
                	});
        	}	

        	pageAPI.cvInputAPI.addSaveCVCallback(saveCV);

		
		var searchCallback = function() {
			var jsonOb = pageAPI.cvInputAPI.getData();
			var json = buildQueryJSON(jsonOb, 0);
			window.console.log("ASTAAAA" + json);
			
			$.ajax({
				"url": /*(function(){
					if (jsonOb.cv.positions._total == 0 && jsonOb.cv.educations._total >= 1) {
						return "http://localhost/results.json";
					}
					else if (jsonOb.cv.positions.values[0].title.indexOf("java") != -1){
						return "http://localhost/results_software_engineer_java.json";
					}
					else {
						return "http://localhost/results_software_engineer.json";
					}
				})(),*/
			    "http://localhost/mock.json"/*apiURL + "search"*/,
				"async": true,
				"type": "post",
				"data": {"content": json},
				"success": function (data, textStatus, jqXHR) {
					//window.console.log("Din ajax : " + JSON.stringify(data));
					window.console.log("Asta e text: " + jqXHR.responseText);
					if (typeof(data) == "string") {
						pageAPI.livePreviewAPI.update(JSON.parse(data));
					}
					else if (typeof(data) == "object"){
						pageAPI.livePreviewAPI.update(data);
					}
					else {
						window.console.error("Serverul a respuns cu ceva total neasteptat");
					}
				},
				"error": function(jqXHR, textStatus, errorThrown) {
					window.console.log("A crapat : " + errorThrown);
				}
			});
		};
		
		
		
		
		pageAPI.cvInputAPI.addSearchCallback(searchCallback);
		searchCallback();
		
	};
	

    var getCV = function(){
		$.ajax({
		"url": "http://localhost/cv.json"/*apiURL+"cv/get/"*/,
		"async": true,
		"type": "get",
		"data": {"content": ""},
		"success": function (data, textStatus, jqXHR) {
			if (typeof(data) == "string") {
				pageAPI.cvInputAPI.setCV(JSON.parse(data));
			}
			else if (typeof(data) == "object"){
              pageAPI.cvInputAPI.setCV(data);
			}
            else {
			  window.console.error("Rezultat aiurea");
            }
		},
		"error": function(jqXHR, textStatus, errorThrown) {
			window.console.log("A crapat : " + errorThrown);
		}
		});
	};
	$(document).ready(bootstrap);
	$(window).resize(bootstrap);
	$(document).ready(getCV);

})();

