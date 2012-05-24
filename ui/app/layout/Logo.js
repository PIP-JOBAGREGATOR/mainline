"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.Logo = LayoutManager.Logo || {};

(function() {
	var build = function(container) {
	  var left = $("<div>").css({
        "float": "left",
        "padding-left": "20px",
        //"background": "url(images/logo.png) no-repeat center",
        "width": "543px",
        "height": "75px"
      });
      var right = $("<div>").css({"float": "right", "padding-right": "20px", "padding-top": "5px"});

      right.append("<script type=\"in/Login\" data-onAuth=\"onLinkedInAuth\"></script>")

      $(container).append(left).append(right).append( $("<div>").css("clear", "both") );
    };


	LayoutManager.Logo["build"] = build;
})();
