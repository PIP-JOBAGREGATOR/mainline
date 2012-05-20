"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.PrefsPage = {};

(function() {
	var build = function(container){
	// aici creezi divurile si inputurile si orice HTML ai nevoie
		
		var mydiv = document.createElement("div");
		var checkbox = document.createElement("input");
		
		var radio1 = document.createElement("input");
		var radio2 = document.createElement("input");
		var radio3 = document.createElement("input");
		
		var buton = document.createElement("button");
		var logo = document.createElement("div");
		var checkboxContainer = document.createElement("div");
		var radioContainer = document.createElement("div");
		
		var label = document.createElement("label");
		var label1 = document.createElement("label");
		var label2 = document.createElement("label");
		var label3 = document.createElement("label");
	
		label.innerText = "Vrei notificari? CLICK";
		$(label).attr("for", "check");
		$(checkbox).attr("id", "check");
		$(checkbox).attr("type", "checkbox");
		
		$(checkbox).css(
						{
							"width" : 100 +"px",
							"height" : 100 +"px",
							"background-color" : "yellow"
							});
		
		$(checkboxContainer).append(checkbox).append(label);

		$(checkbox).button();
		
		label1.innerText = "o data pe saptamana";
		label2.innerText = "de doua ori pe saptamana";
		label3.innerText = "zilnic";
		$(label1).attr("for", "radio1");
		$(label2).attr("for", "radio2");
		$(label3).attr("for", "radio3");
		
		$(radio1).attr("id", "radio1");
		$(radio2).attr("id", "radio2");
		$(radio3).attr("id", "radio3");
		
		$(radio1).attr("type", "radio");
		$(radio2).attr("type", "radio");
		$(radio3).attr("type", "radio");
		
		$(radio1).attr("name", "radiou");
		$(radio2).attr("name", "radiou");
		$(radio3).attr("name", "radiou");
		
		var cssStyle = {
			"width": 1000+"px"
		};
		
		$([radio1, radio2, radio3]).css(cssStyle);
		
		$(radioContainer).css(
					{
						"position": "relative",
						"font-size": 62.5+"%",
						"top": 100+"px",
						"left": 100+"px"
					});
		
		
		
		$(radioContainer).append(radio1).append(label1).append(radio2).append(label2).append(radio3).append(label3);

		$(mydiv).append(radioContainer);
		$(radioContainer).buttonset();
		
		$(buton).button({"label": "Configureaza LinkedIn"});

		logo["logoHeight"] = 150;
		$(logo).append(checkboxContainer).append(buton);
		
		$(checkbox).click(function(event, ui) {
		    var afisat = $(mydiv).css("display");
			
			if (afisat == "none"){
		    
				$(mydiv).css("display","block");
			}
			else {
				$(mydiv).css("display","none");
			}
		});
		
		$(buton).click(function(event,ui){
		
			window.open("http://www.linkedin.com/");
		});
		
		//Aici le pui css ca sa le aranjezi si stilizezi
		$(mydiv).css(
			{
				"width" : 0.4 * Environment.getWindowWidth() + "px",
				"height" : (Environment.getWindowHeight() - logo.logoHeight)+ "px",
				"position" : "absolute",
				"top" : logo.logoHeight + "px",
				"background-color" : "red",
				"display": "none"
			});


		$(logo).css({
			"width" : 0.4 * Environment.getWindowWidth() + "px",
			"height" : logo.logoHeight + "px",
			"position" : "absolute",
			"background-color" : "yellow"
		});
		//aici creezi ce mai trebuiew in fiecare div

		
		//adaugi tot ce ai facut in body
		$(container).append(mydiv);
		
		$(container).append(logo);

}
		LayoutManager.PrefsPage["build"] = build;

})();
