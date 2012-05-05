"use strict";

var LayoutManager = (function() {

	/**
	 * Builds the whole cvInput and appends it to the container given as
	 * parameter
	 */
	var buildCvInput = function(container) {
		// Create variables
		var searchBar = document.createElement("div");
		var searchButton = document.createElement("div");
		var searchInput = document.createElement("input");
		var pagedInputContainer = document.createElement("div");
		var pagedInput = null;

		var containerWidth = parseInt($(container).css("width"));
		var containerHeight = parseInt($(container).css("height"));

		// Set global properties to elements
		searchBar["searchBarHeight"] = 45;
		searchBar["searchBarWidth"] = containerWidth - 20;
		searchButton["searchButtonWidth"] = 125;

		// add css
		$(searchBar).css({
			"width" : searchBar.searchBarWidth + "px",
			"height" : searchBar.searchBarHeight + "px",
			"position" : "relative",
			"left" : "10px",
			"top" : "5px"
		});
		$(searchBar).addClass("ui-widget-content ui-corner-all");

		$(searchButton).css({
			"width" : searchButton.searchButtonWidth + "px",
			"height" : (searchBar.searchBarHeight - 3) + "px",
			"float" : "right"
		});

		$(searchInput).css(
				{
					"width" : (searchBar.searchBarWidth
							- searchButton.searchButtonWidth - 5)
							+ "px",
					"height" : searchBar.searchBarHeight + "px",
					"border" : "0px",
					"float" : "left",
					"font-size" : "20px"
				});
		$(searchInput).addClass("ui-widget-content");

		$(pagedInputContainer)
				.css(
						{
							"width" : searchBar.searchBarWidth + "px",
							"height" : (containerHeight
									- searchBar.searchBarHeight - 20)
									+ "px",
							"position" : "relative",
							"left" : "10px",
							"top" : "10px"
						});
		$(pagedInputContainer).addClass("ui-widget-content ui-corner-all");

		// Setup jqueryui components
		$(searchButton).button({
			"label" : "Cauta job"
		});

		pagedInput = new PagedContainer(pagedInputContainer);
		var colors = [ "green", "yellow", "pink", "orange", "white" ];
		for ( var i = 0; i < 5; ++i) {
			var page = document.createElement("div");
			$(page).css({
				"background-color" : colors[i],
				"height" : "600px"
			});
			page.innerText = "page" + i;
			pagedInput.addPage(page);
		}

		// Add elements to DOM
		$(searchBar).append(searchInput);
		$(searchBar).append(searchButton);
		$(container).append(searchBar);
		$(container).append(pagedInputContainer);
		
		
		return {
			"getData": function() {
				return {
					"searchBar": searchInput.value
				};
			},
			"addSearchCallback" : function(callback) {
				$(searchButton).click(callback);
				$(searchInput).keyup(callback);
			}
		};
	};

	var buildLivePreview = function(container, searchResults) {
		var containerWidth = parseInt($(container).css("width"));
		var containerHeight = parseInt($(container).css("height"));

		var cellWidth = containerWidth - 20;
		var cellHeight = 150;

		var createCell = function(cellData) {
			var cell = document.createElement("div");
			$(cell).css({
				"width" : cellWidth,
				"height" : cellHeight,
				"position" : "relative",
				"left" : "10px",
				"margin-top" : "5px"
			});
			$(cell).addClass("ui-widget-content ui-corner-all");

			var header = document.createElement("div");
			$(header).css({
				"text-indent" : "15px"
			}).addClass("ui-widget-header ui-corner-all");
			header.innerText = cellData.titlu;

			var descriere = document.createElement("div");
			descriere.innerText = "Descriere job : " + cellData.descriere;

			var link = document.createElement("a");
			link.innerText = cellData.link;
			link.setAttribute("href", cellData.link);

			$(cell).append(header).append(descriere).append(link);

			return cell;
		};

		if (searchResults) {
			var testCell = createCell({
				"titlu" : "Ana nu prea mai are mere",
				"descriere" : "Pai normal ca nu mai are pentru ca le-a mancat pe toata ca o nehalita",
				"link" : "https://www.google.ro/#hl=ro&biw=1680&bih=952&sclient=psy-ab&q=Ana+nu+mai+are+mere&oq=Ana+nu+mai+are+mere&aq=f&aqi=&aql=&gs_nf=1&gs_l=hp.3...6235.9986.1.10320.27.23.4.0.0.0.210.3258.0j22j1.31.0.oJ9_K8Y2bRo&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=8ae372e723ec5560"
			});

			var testCell2 = createCell({
				"titlu" : "Ana nu prea mai are mere",
				"descriere" : "Pai normal ca nu mai are pentru ca le-a mancat pe toata ca o nehalita",
				"link" : "https://www.google.ro/#hl=ro&biw=1680&bih=952&sclient=psy-ab&q=Ana+nu+mai+are+mere&oq=Ana+nu+mai+are+mere&aq=f&aqi=&aql=&gs_nf=1&gs_l=hp.3...6235.9986.1.10320.27.23.4.0.0.0.210.3258.0j22j1.31.0.oJ9_K8Y2bRo&pbx=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&fp=8ae372e723ec5560"
			});

			$(container).append(testCell).append(testCell2);
		} else {
			container.innerText = "Cauta ceva nu sta si te uita ca vitelu la poarta noua";
		}
		
		return {
			update: function(data) {
				window.console.log("update dada : " + JSON.stringify(data));
				var cell = createCell(data[0]["duplicate"][0]);
				$(container).append(cell);
				
			}
		};
	};

	var buildLogo = function(container) {
		container.innerText = "LOGO";
		$(container).css("font-size", "90px");
	};

	var buildSearchPage = function() {
		var cvInput = document.createElement("div");
		var livePreview = document.createElement("div");
		var logo = document.createElement("div");

		logo["logoHeight"] = 150;

		$(cvInput).css(
						{
							"width" : 0.4 * Environment.getWindowWidth() + "px",
							"height" : (Environment.getWindowHeight() - logo.logoHeight)
									+ "px",
							"position" : "absolute",
							"top" : logo.logoHeight + "px",
							"background-color" : "red"
						});

		$(livePreview).css({
			"width" : 0.6 * Environment.getWindowWidth() + "px",
			"height" : Environment.getWindowHeight() + "px",
			"position" : "absolute",
			"left" : 0.4 * Environment.getWindowWidth() + "px",
			"background-color" : "blue"
		});

		$(logo).css({
			"width" : 0.4 * Environment.getWindowWidth() + "px",
			"height" : logo.logoHeight + "px",
			"position" : "absolute",
			"background-color" : "yellow"
		});

		var cvInputAPI = buildCvInput(cvInput);
		var livePreviewAPI = buildLivePreview(livePreview);
		buildLogo(logo);

		$(document.body).append(cvInput);
		$(document.body).append(livePreview);
		$(document.body).append(logo);

		return {
			"cvInputAPI": cvInputAPI,
			"livePreviewAPI": livePreviewAPI
		};
	};
	
	
	
	
	var buildPrefPage = function() {
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
							"height" : (Environment.getWindowHeight() - logo.logoHeight)
									+ "px",
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
	
		$(document.body).append(mydiv);
		
		$(document.body).append(logo);

	};
	
	

	var clean = function() {
		var children = document.body.childNodes;

		for ( var i = children.length - 1; i >= 0; --i) {
			document.body.removeChild(children[i]);
		}
	};

	return {
		buildSearchPage : buildSearchPage,
		buildPrefPage: buildPrefPage,
		clean : clean
	};
})();