"use strict";

var LayoutManager = LayoutManager || {};

(function() {

	var buildLogo = function() {
		var logo = document.createElement("div");
		logo["logoHeight"] = 100;
		
		$(logo).css({
			"width" : Environment.getWindowWidth() + "px",
			"height" : logo.logoHeight + "px",
			"position" : "absolute",
            "background": "url(images/top.png) no-repeat center",
			//"background-color" : "#3B5998",
			"border-bottom": "solid 2px black",
			"font-size": "45px", 
			"color": "white"
		});

		LayoutManager.Logo.build(logo);		
		$(document.body).append(logo);

		return logo;
	}
	var buildMenu = function(main){
		var menu = document.createElement("div");
		menu["menuHeight"] = 50;
		
		$(menu).css({
			"width" : Environment.getWindowWidth() + "px",
			"height" : (menu.menuHeight - 2)+ "px",
			"position" : "absolute",
			//"background-color" : "#3B5998",
            "background": "url(images/bottom.png) no-repeat center",
            "background-size": "100%",
			"border-top": "solid 2px black",
			"bottom" : "0px",
			"color": "white"
		});

		LayoutManager.Menu.build(menu,main);		
		$(document.body).append(menu);

		return menu;
	}
	
	/* This build the whole user interface */
	var buildUI = function() {
		
		var searchDiv = document.createElement("div");
		var prefsDiv = document.createElement("div");
		var main = document.createElement("div");
		var mainInterior = document.createElement("div");
		var corner = $("<div>");
		
		var logo = buildLogo();
		var menu = buildMenu(main);

		searchDiv["height"] = (Environment.getWindowHeight() - logo.logoHeight - menu.menuHeight);
		prefsDiv["height"] = (Environment.getWindowHeight() - logo.logoHeight - menu.menuHeight);

		$(main).css({
			"position" : "absolute",
			"left" : "0px",
			"top" : logo.logoHeight + "px",
			"-webkit-transition": "left 0.5s",
			"-moz-transition": "left 0.5s",
			"width" : (Environment.getWindowWidth()) + "px",
			"height" : (Environment.getWindowHeight() - logo.logoHeight - menu.menuHeight)  + "px"
		});

		$(mainInterior).css({
			"width" : (2*Environment.getWindowWidth()) + "px",
			"height" : (Environment.getWindowHeight() - logo.logoHeight - menu.menuHeight)  + "px"
		});

		$(searchDiv).css({
          "float": "left",
          //"background" : "url(images/middle.png) no-repeat",
          //"background-size" : "100%",
          "width" : Environment.getWindowWidth() + "px",
		  "height" : (Environment.getWindowHeight() - logo.logoHeight - menu.menuHeight)  + "px"
		});
		$(prefsDiv).css({
          "float" : "left",
          "width" : Environment.getWindowWidth() + "px",
		  "height" : (Environment.getWindowHeight() - logo.logoHeight - menu.menuHeight) + "px",
		});
		
		corner.css({
			"width": "50px", 
			"height": "50px", 
			"position":"absolute", 
			"bottom": "0px", 
			"right": "0px", 
			"background-image": "url(images/corner.png)"});
        
        $(mainInterior).append(searchDiv).append(prefsDiv).append($("<div>").css("clear", "both"));
	
        corner.click(function() {
          var dialogContent = $("<div>").append( $("<p>").append("Nokia, connecting people") )
            .append( $("<p>").append("ACER, empowering people") )
            .append( $("<p>").append("Job'o'tron, employing people"));
          
          $("<div>").append(dialogContent).dialog({
            modal: true,
            buttons: {
              Ok: function() {
                $( this ).dialog( "close" );
                                                    }
              }
          });
        });


		$(main).append(mainInterior);
		$(document.body).append(main);
		$(document.body).append(corner);
		LayoutManager.PrefsPage.build(prefsDiv);
		return LayoutManager.SearchPage.build(searchDiv);
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
