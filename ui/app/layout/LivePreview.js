"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.SearchPage = LayoutManager.SearchPage || {};

(function() {
	var buildLivePreview = function(container, searchResults) {
		var containerWidth = parseInt($(container).css("width"));
		var containerHeight = parseInt($(container).css("height"));

		var cellWidth = containerWidth - 40;
		var cellHeight = 150;
        var stanga = 130;

		// Creates a cell with a job
		var createCell = function(cellData) {
		  var titlu = cellData.titlu == "" ? "Fara titlu" : cellData.titlu;
          var descriere = cellData.descriere == "" ? "Jobul nu contine o descriere" : cellData.descriere.substr(0, 200) + " ...";
          var link = cellData.link;
          
          var cell = $("<div>").css({
            "width": cellWidth + "px",
            "height": "150px",
            "margin-top": "20px"
          }).addClass("job-container");
          
          var left = $("<div>").css({
            "float": "left",
            "height": "100%",
            "width": stanga + "px",
            "background": "url(images/dot-line.png) right repeat-y",
            "background-color": "white"
          }).append($("<div>").css({
            "height": "38px",
            "width": "100%",
            "background": "url(images/pin.png) 10px no-repeat",
            "position": "relative",
            "border-bottom": "solid 3px #385998"
            //"top": "38px"
          })).append($("<div>").css({
            "position": "relative",
            "top": "10px",
            "left": "15px"
          }).append("Descriere")).append($("<div>").css({
            "position": "relative",
            "top": "69px",
            "left": "15px"
          }).append("Link"));

          var right = $("<div>").css({
            "float": "left",
            "height": "100%",
            "width": (cellWidth - stanga) + "px",
            "background-color": "white"
          });
          
         var doOnClick = function() {
            right.css({
              "-webkit-transform": "rotate(2deg)",
              "position": "relative",
              "left": "3px",
              "top": "13px",
              "-webkit-box-shadow": "4px 4px 10px #222222, 0px 0px 15px #222222" 
            });
            left.css({
              "-webkit-box-shadow": "4px 4px 10px #222222, 0px 0px 15px #222222" 
            });

            cell.removeClass("job-container").css({
              "margin-top": "20px"
            })

         };
          cell.append(left).append(right).append( $("<div>").css("clear", "both") );

          right.append($("<p>").css({
            "font-size" : "18pt",
            "font-style" : "italic",
            "padding-top" : "5px",
            "margin-bottom" : "5px",
            "text-indent": "30px"
          }).append(titlu));
          right.append( $("<div>").css({
            "margin-left": "auto",
            "margin-right": "auto",
            "height": "3px",
            "width": "100%",
            "background-color": "#3B5998"
          }) );
          right.append($("<div>").css({
            "width": "100%",
            "height": "100px"
          }).append($("<div>").css({
            "font-size" : "11pt", 
            "padding-left": "10px",
            "height": "80px",
            "overflow": "hidden",
            "text-indent": "30px"}).append(descriere))
            .append( $("<div>").css({
            
            }).append( $("<a>").attr({"href": link, "target": "_blank"}).click(doOnClick)
              .css({
                "font-size" : "11pt",
                "padding-left": "10px",
              }).append(link)) ));

          return cell[0];
        };

		if (searchResults) {
			// a search result is returned

			var pagedOutputContainer = document.createElement("div");
			var pagedOutput = null;

			$(pagedOutputContainer).css({
				"width" : containerWidth + "px",
				"height" : (containerHeight) + "px"
			});

			// paginate the results
			pagedOutput = new PagedContainer(pagedOutputContainer);
			var currentPage = null;
			for ( var i = 0; i < searchResults.length; ++i) {
				var currentResult = searchResults[i];
				//var resultToDisplay = currentResult[0];
				var cell = createCell(currentResult);

				if (currentPage == null) {
					currentPage = document.createElement("div");
					currentPage["filledHeight"] = 0;
				}

				$(currentPage).append(cell);
				currentPage["filledHeight"] += cellHeight;

				if (currentPage["filledHeight"] + cellHeight > containerHeight) {
					// the current page is completely filled
					pagedOutput.addPage(currentPage);
					currentPage = null;
				}
			}
			if (currentPage != null) {
				pagedOutput.addPage(currentPage);
			}

			$(container).append(pagedOutputContainer);
		} else {
			container.innerText = "";
		}

		return {
			update : function(data) {
				window.console.log("update dada : " + JSON.stringify(data));

				$(container).empty();

				buildLivePreview(container, data);
			}
		};
	};



	LayoutManager.SearchPage["buildLivePreview"] = buildLivePreview;
	
})();












