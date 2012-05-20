"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.SearchPage = LayoutManager.SearchPage || {};

(function() {
	
	var fields = [ "Nume", "Prenume", "Numar de telefon", "E-mail",
					"Data nasterii", "Adresa", "Titlu", "Industrie",
					"Interese", "Sumar", "Pozitii anterioare", "Publicatii",
					"Limbi", "Aptitudini", "Certificari", "Educatie", "Cursuri",
					"Voluntariat" ];
	var usedFields = {};
	
	var positionsArr = [];
	var educationsArr = [];
	var searchCallback = null;
	
	var searchButton = null;
	var searchInput = null;
	
	var buildSearchBar = function(container) {
		var searchBar = container;
		searchButton = document.createElement("div");
		searchInput = document.createElement("input");
		
		var searchBarHeight = 45;
		var searchBarWidth = parseInt($(container).css("width"));
		var searchButtonWidth = 130;

		$(searchBar).css({
			"width" : searchBarWidth + "px",
			"height" : searchBarHeight + "px",
			"position" : "relative",
			"left" : "10px",
			"top" : "5px"
		});
		$(searchBar).addClass("ui-widget-content ui-corner-all");

		$(searchButton).css({
			"width" : searchButtonWidth + "px",
			"height" : (searchBarHeight - 3) + "px",
			"float" : "right"
		});

		$(searchInput).css(
				{
					"width" : (searchBarWidth - searchButtonWidth - 5) + "px",
					"height" : searchBarHeight + "px",
					"border" : "0px",
					"float" : "left",
					"font-size" : "20px"
				});
		$(searchInput).addClass("ui-widget-content");

		$(searchButton).button({
			"label" : "Cauta job"
		});
		
		$(searchBar).append(searchInput);
		$(searchBar).append(searchButton);
	};
	
	
	var buildCvHandler = function(pagedContainer) {
		var textFieldLabel = ["Nume", "Prenume", "Numar de telefon", "Adresa", "Sumar", "Interese", 
		                      "Industrie","Titlu", "Limbi", "E-mail", "Publicatii", "Aptitudini", "Certificari", "Cursuri"];
		
		var buildInputWithTitle = function(title, tip, opt) {
			var divCSS = {
					"margin-bottom": "3px",
				};
			
			var titleContainer = $("<div>").css({"height": "100%", "width":"30%"})
				.addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only").append(title);
			
			var textField = document.createElement("input");
			$(textField).attr("type", "text");
			$(textField).css({
				"width": "65%",
				"border": "0px"
			});
			$(textField).addClass("ui-autocomplete-input ui-widget-content ui-corner-all").change(searchCallback);
			
			var theDiv = $("<div>").css(divCSS).addClass("ui-widget-content ui-corner-all");
			if (tip) {
				if (tip == "autocomplete") {
					$(textField).autocomplete(opt);
				}
				else if (tip == "datepicker") {
					$(textField).datepicker();
				}
			}
			
			theDiv.append(titleContainer).append(textField);
			
			return theDiv;
		};
		
		var buildAndAddFields = function(label, container) {
			if (textFieldLabel.indexOf(label) != -1) {
				//Trebuie sa adaug numai un textfield
				var textField = document.createElement("input");
				$(textField).attr("type", "text");
				$(textField).css({
					"width": "100%"
				});
				$(textField).addClass("ui-autocomplete-input ui-widget-content ui-corner-all");
				
				$(container).append(textField);
				$(textField).focus();
			}
			else if (label == "Data nasterii") {
				var input = null;
				$(container).append((input = $("<input>").attr("type", "text")
						.addClass("ui-autocomplete-input ui-widget-content ui-corner-all").datepicker()));
				input.focus();
			}
			else if (label == "Pozitii anterioare") {
				positionsArr.push(container);
				
				var divCSS = {
					"margin-bottom": "3px",
				};
				

				$(container).append($("<div>").css(divCSS).append(buildInputWithTitle("Titlu")));
				
				$(container).append($("<div>").css(divCSS).append(
						buildInputWithTitle("Data inceput", "datepicker")
				).append(
						buildInputWithTitle("Data sfarsit", "datepicker")
				));
				
				$(container).append($("<div>").css(divCSS).append(buildInputWithTitle("Nume companie")));
				
				$(container).append($("<div>").css(divCSS).append(
						$("<textarea>").attr({"value": "Descriere"})
						.addClass("ui-autocomplete-input ui-widget-content ui-corner-all").css({"width": "100%", "height": "100px"})
						.change(searchCallback)
				));
			}
			else if (label == "Educatie") {
				educationsArr.push(container);
				var divCSS = {
						"margin-bottom": "3px",
					
					};
					
					$(container).append($("<div>").css(divCSS).append(
						buildInputWithTitle("Nume inst. de inv.")
					));
					
					$(container).append($("<div>").css(divCSS).append(
							buildInputWithTitle("Dom. de studiu")
					).append(
							buildInputWithTitle("Gradul", "autocomplete", {"source": ["Gimnaziu", "Liceu","Licenta", "Master", "Doctorat"], "minLength": 0})
					).append(
							$("<div>").css("clear", "both")
					));
			}
			else {
				container.innerText = "Ai selectat " + label;
			}
			
		};
		
		var buildCombobox = function(values, usedValues) {
			var select = document.createElement("select");
			
			var option = document.createElement("option");
			$(option).attr("value", "");
			option.innerText = values[i];
			$(select).append(option);
			
			for(var i = 0; i < values.length; ++i) {
				if (usedValues.hasOwnProperty(values[i]) == true)
					continue;
				var option = document.createElement("option");
				$(option).attr("value", values[i]);
				option.innerText = values[i];
				$(select).append(option);
			}
			
			var lukeIAmYourFather = document.createElement("div");
			$(lukeIAmYourFather).append(select);
			$(select).combobox({
				"selected": function(event, ui) {
					//window.console.log("Ai selectat : " + ui.item.label);
					if (ui.item.label != "Pozitii anterioare" && ui.item.label != "Educatie")
						usedFields[ui.item.label] = true;
					buildAndAddFields( ui.item.label, this.inTheDOM.parentElement.nextSibling);
				}
			});
			select["inTheDOM"] = select.nextSibling;
			
			return select.nextSibling;
		};
		
		var buildField = function () {
			var fieldContainer = document.createElement("div");
			var left = document.createElement("div");
			var right = document.createElement("div");
			
			$(fieldContainer).css({
				"width": (pagedContainer.parameters["containerWidth"] - 45) + "px",
				"position": "relative",
				"left": "10px",
				"padding-top": "12px",
				"padding-left": "5px",
				"padding-bottom": "3px",
				"margin-top": "5px"
			});
			$(fieldContainer).addClass("ui-widget-content ui-corner-all");
			
			$(left).css({
				"float": "left",
				"width": "30%",
				"position": "relative",
				"top": "-8px"
			});
			$(right).css({
				"float": "left",
				"width": "60%",
				"padding-left": "20px"
			});
			$(fieldContainer).append(left).append(right).append( $(document.createElement("div")).css("clear", "both"));
			
			$(left).append(buildCombobox(fields, usedFields));
			
			//TODO De aici nu trebuie sa mai fie nimic. Ce e in dreapta se construieste dupa ce se alege un camp
			
			return fieldContainer;
		};

		var currentPage = document.createElement("div");
		var addFieldButton = document.createElement("div");

		$(pagedContainer.pages).css({
			"font-size": "62.5%"
		});
		
		$(addFieldButton).button({
			"label" : "Adauga camp la CV"
		});
		$(addFieldButton).click(function() {
			$(currentPage).append(buildField());
		});
		
		$(currentPage).append(addFieldButton);
		
		
		pagedContainer.addPage(currentPage);
	};

	/**
	 * Builds the whole cvInput and appends it to the container given as
	 * parameter
	 */
	var buildSearchInput = function(container) {
		// Create variables
		var searchBar = document.createElement("div");
		var pagedInputContainer = document.createElement("div");
		var pagedInput = null;

		var containerWidth = parseInt($(container).css("width"));
		var containerHeight = parseInt($(container).css("height"));

		$(searchBar).css("width", (containerWidth - 20) + "px");


		$(pagedInputContainer).css({
			"width" : (containerWidth - 20) + "px",
			"height" : (containerHeight
					- 45 - 20)
					+ "px",
			"position" : "relative",
			"left" : "10px",
			"top" : "10px"
		});
		$(pagedInputContainer).addClass("ui-widget-content ui-corner-all");


		pagedInput = new PagedContainer(pagedInputContainer);
		
		buildSearchBar(searchBar);
		buildCvHandler(pagedInput);
		
		$(container).append(searchBar);
		$(container).append(pagedInputContainer);

		return {
			"getData" : function() {
				return {
					"searchBar" : searchInput.value,
					"cv": {
						"positions": {
							"_total": positionsArr.length,
							"values" : (function() {
								var rez = new Array();
								for (var i = 0; i < positionsArr.length; ++i) {
									var p = positionsArr[i];
									rez.push({
										"title": p.childNodes[0].childNodes[0].childNodes[1].value,
										"summary": p.childNodes[3].childNodes[0].value
									});
								}
								return rez;
							})()
						},
						"educations": {
							"_total": educationsArr.length,
							"values" : (function() {
								var rez = new Array();
								for (var i = 0; i < educationsArr.length; ++i) {
									var p = educationsArr[i];
									rez.push({
										"schoolName": p.childNodes[0].childNodes[0].childNodes[1].value
									});
								}
								return rez;
							})()
						}
					}
				};
			},
			"addSearchCallback" : function(callback) {
				$(searchButton).click(callback);
				$(searchInput).keyup(callback);
				searchCallback = callback;
			}
		};
	};
	
	
	

	LayoutManager.SearchPage["buildSearchInput"] = buildSearchInput;
	
})();