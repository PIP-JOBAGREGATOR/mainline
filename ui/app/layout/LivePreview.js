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
			var cell = document.createElement("div");
			$(cell).css({
				"width" : cellWidth,
				"height" : cellHeight,
				"position" : "relative",
				"left" : "10px",
				"margin-top" : "5px",
				"z-index" : "2"
			});
			$(cell).addClass("ui-widget-content ui-corner-all");
			//$(cell).addClass("box effect3");

			var header = document.createElement("div");
			$(header).css({
				"text-indent" : "15px"
			}).addClass("ui-widget-header ui-corner-all");
			header.innerText = cellData.titlu == "" ? "Fara titlu" : cellData.titlu;

			var descriere = document.createElement("div");
			descriere.innerText = "Descriere job : " + cellData.descriere + " ...";

			var link = document.createElement("a");
			link.innerText = cellData.link;
			$(link).attr({"href": cellData.link, "target": "_blank"});

			$(cell).append(header).append(descriere).append(link);

			return cell;
		};

		if (searchResults) {
			// a search result is returned

			var pagedOutputContainer = document.createElement("div");
			var pagedOutput = null;

			$(pagedOutputContainer).css({
				"width" : containerWidth + "px",
				"height" : (containerHeight-50) + "px"
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












