"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.SearchPage = LayoutManager.SearchPage || {};

(function() {
	var buildLivePreview = function(container, searchResults) {
		var containerWidth = parseInt($(container).css("width"));
		var containerHeight = parseInt($(container).css("height"));

		var cellWidth = containerWidth - 40;
		var cellHeight = 150;

		// Creates a cell with a job
		var createCell = function(cellData) {
		  var titlu = cellData.titlu == "" ? "Fara titlu" : cellData.titlu;
          var descriere = cellData.descriere == "" ? "Jobul nu contine o descriere" : cellData.descriere + " ...";
          var link = cellData.link;
          
          var cell = $("<div>").css({
            "width": cellWidth + "px",
            "height": cellHeight + "px"
          }).addClass("job-container ui-corner-all");
          
          var content = $("<div>").css({
            "width": cellWidth - 16,
            "height": cellHeight - 16
          })

          cell.append(content);

          content.append($("<p>").append(titlu));
          content.append( $("<div>") );
          
          var content2 = $("<div>").css({
            "width": cellWidth - 33,
            "height": cellHeight - 55
          });
          content.append(content2);

          var left = $("<div>").css({
            "float": "left",
            "width": "100px",
            "height": "100%"
          });
          var bar = $("<div>").css({
            "float": "left",
            "width": "1px",
            "height": "100%",
            "background-color": "black"
          });
          var right = $("<div>").css({
            "float": "left",
            "width": (cellWidth - 144) + "px",
            "height": "100%"
          }) ;

          content2.append(left).append(bar).append(right).append( $("<div>").css("clear", "both") );
          
          left.append($("<span>").append("Descriere:"))
            .append( $("<span>").css({
              "position": "absolute",
              "bottom": "0px",
              "left": "0px",
            }).append("Link:") );

           right.append($("<span>").append(descriere))
            .append( $("<span>").css({
              "position": "absolute",
              "bottom": "0px",
              "left": "0px",
            }).append( $("<a>").attr({"href": link, "target": "_blank"}).append(link)) );


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
			container.innerText = "Cauta ceva nu sta si te uita ca vitelu la poarta noua";
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












