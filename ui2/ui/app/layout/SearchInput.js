"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.SearchPage = LayoutManager.SearchPage || {};

(function() {

	var fields = [ "Nume", "Prenume", "Numar de telefon", "E-mail",
					"Data nasterii", "Adresa", "Titlu", "Industrie",
					"Interese", "Sumar", "Pozitii anterioare", "Publicatii",
					"Limbi", "Aptitudini", "Certificari", "Educatie", "Cursuri"];
	var usedFields = {};
    var cvMapping = {
      "Nume": "lastName",
      "Prenume": "firstName",
      "Numar de telefon": "phoneNumbers",
      "E-mail": "imAccounts",
      "Data nasterii": "dateOfBirth",
      "Adresa": "mainAddress",
      "Titlu": "headline",
      "Industrie": "industry",
      "Interese": "interests",
      "Sumar": "summary",
      "Pozitii anterioare": "positions",
      "Publicatii": "publications",
      "Limbi": "languages",
      "Aptitudini": "skills",
      "Certificari": "certifications",
      "Educatie": "educations",
      "Cursuri": "courses"
    };

    var stringFields = [
      "Nume", "Prenume", "Adresa", "Titlu", "Industrie", "Interese", "Sumar"
    ];

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

            if (stringFields.indexOf(label) != -1) {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var right = container.childNodes[0].value;
                var rez = {};
                rez[left] = right;
                return rez;
              }
            }
            else if (label == "Numar de telefon") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var rez = {};
                rez[left] = {
                  "_total" : 1,
                  "values": [{
                    "phoneNumber": container.childNodes[0].value,
                    "phoneType": "mobile"
                  }]
                };
                return rez;
              }
            }
            else if (label == "E-mail") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var rez = {};
                rez[left] = {
                  "_total" : 1,
                  "values": [{
                    "imAccountName": container.childNodes[0].value,
                    "imAccountType": "e-mail"
                  }]
                };
                return rez;
              }
            }
            else if (label == "Data nasterii") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var val = container.childNodes[0].value;
                var luna = val.substr(0,2), zi = val.substr(3,2), an = val.substr(6,4);
                var rez = {};
                rez[left] = {
                  "day": parseInt(zi),
                  "month": parseInt(luna),
                  "year": parseInt(an)
                };
                return rez;
              }
            }
            else if (label == "Pozitii anterioare") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var rez = {};
                var sdate = new Date(container.childNodes[1].childNodes[0].childNodes[1].value);
                var edate = new Date(container.childNodes[1].childNodes[1].childNodes[1].value);
                rez[left] = {
                  "_total" : 1,
                  "values": [{
                    "title": container.childNodes[0].childNodes[0].childNodes[1].value,
                    "startDate": { "month": sdate.getMonth(), "year": sdate.getFullYear() },
                    "endDate": { "month": edate.getMonth(), "year": edate.getFullYear() },
                    "company": { "industry" : "", "name": container.childNodes[2].childNodes[0].childNodes[1].value},
                    "summary" : container.childNodes[3].childNodes[0].value
                  }]
                };
                return rez;
              }
            }
            else if (label == "Publicatii") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var rez = {};
                rez[left] = {
                  "_total" : 1,
                  "values": [{ "title": container.childNodes[0].value
                  }]
                };
                return rez;
              }
            }
            else if (label == "Limbi") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var rez = {};
                rez[left] = {
                  "_total" : 1,
                  "values": [{ "language": { "name": container.childNodes[0].value }
                  }]
                };
                return rez;
              }
            }
            else if (label == "Aptitudini") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var rez = {};
                rez[left] = {
                  "_total" : 1,
                  "values": [{ "skills": { "name": container.childNodes[0].value }
                  }]
                };
                return rez;
              }
            }
            else if (label == "Certificari") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var rez = {};
                rez[left] = {
                  "_total" : 1,
                  "values": [{ "name": container.childNodes[0].value }]
                };
                return rez;
              }
            }
            else if (label == "Educatie") {
              container["serialize"] = function() {
                var left = cvMapping[label];
                var rez = {};
                rez[left] = {
                  "_total" : 1,
                  "values": [{
                    "schoolName": container.childNodes[0].childNodes[0].childNodes[1].value,
                    "fieldOfStudy": container.childNodes[1].childNodes[0].childNodes[1].value,
                    "degree": container.childNodes[1].childNodes[1].childNodes[1].value  
                  }]
                };
                return rez;
              }

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

        pagedInputContainer["serialize"] = function() {
          var root = pagedInputContainer;
          var rez = {};

          for (var i = 1; i < root.childNodes[0].childNodes[0].childNodes[0].childNodes.length; ++i) {
            var el = root.childNodes[0].childNodes[0].childNodes[0].childNodes[i].childNodes[1];
            var ser = el.serialize();
            for (var pr in ser) {
              rez[pr] = ser[pr];
            }
          }

          return rez;
        };

		buildSearchBar(searchBar);
		buildCvHandler(pagedInput);

		$(container).append(searchBar);
		$(container).append(pagedInputContainer);

		return {
			"getData" : function() {
				return {
					"searchBar" : searchInput.value,
					"cv": pagedInputContainer.serialize()
				};
			},
			"addSearchCallback" : function(callback) {
				$(searchButton).click(callback);
				$(searchInput).keyup(callback);
				searchCallback = callback;
			},
			"setCV": function(CV){
				alert("panda");
			},
			"saveCV" : function(){
				return {
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
				};		
			}
		};
	};




	LayoutManager.SearchPage["buildSearchInput"] = buildSearchInput;

})();
