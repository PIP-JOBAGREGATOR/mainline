"use strict";

var app = (function() {
	var hostname = window.location.hostname;
	if (hostname.length == 0) {
		hostname = "https://192.168.1.105:8443";
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
	        "url": window.hostname + "/api/cv/set/",
	        "async": true,
	        "type": "post",
	        "data": {"content": json},
	        "success": function (data, textStatus, jqXHR) {
              window.console.log("Cv salvat cu succes!");
            },
	        "error": function(jqXHR, textStatus, errorThrown) {
	          window.console.log("A crapat : " + errorThrown);
		    }
	      });
	    }

	  pageAPI.cvInputAPI.addSaveCVCallback(saveCV);

		var searchCallback = function() {

            $("#live-preview-container").css("opacity", "0.5");
            $("#loading-animation").css("opacity", "1.0");

            var jsonOb = pageAPI.cvInputAPI.getData();
			var json = buildQueryJSON(jsonOb, 0);
			

            $.ajax({
			    "async": true,
			    "url": window.hostname + "/api/search/",
				"type": "post",
				"data": {"content": json},
				"success": function (data, textStatus, jqXHR) {
                    $("#live-preview-container").css("opacity", "1.0");
                    $("#loading-animation").css("opacity", "0.0");

					if (typeof(data) == "string") {
                       var ob = data == "" ? {} : JSON.parse(data);
						pageAPI.livePreviewAPI.update(ob);
					}
					else if (typeof(data) == "object"){
						pageAPI.livePreviewAPI.update(data);
					}
					else {
						window.console.error("Serverul a respuns cu ceva total neasteptat");
					}
				},
				"error": function(jqXHR, textStatus, errorThrown) {
                    $("#live-preview-container").css("opacity", "1.0");
                    $("#loading-animation").css("opacity", "0.0");
					window.console.log("A crapat : " + errorThrown);
				}
			});
		};


		pageAPI.cvInputAPI.addSearchCallback(searchCallback);
		searchCallback();
    		window["searchCallback"] = searchCallback;
		
	};


    var getCV = function(){
		$.ajax({
		"url": window.hostname + "/api/cv/get/",
		"async": true,
		"type": "post",
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

    window["getCV"] = getCV;

	$(document).ready(bootstrap);
	$(window).resize(bootstrap);

})();

