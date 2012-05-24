"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.Logo = LayoutManager.Logo || {};

(function() {
	var build = function(container) {
	  var left = $("<div>").css({
        "float": "left",
        "padding-left": "20px",
        "background": "url(images/logo.png) no-repeat center",
        "width": "543px",
        "height": "100px"
      });
      var right = $("<div>").css({
        "float": "right",
        "padding-right": "20px",
        "padding-top": "5px",
        //"position": "relative",
        //"top": "10px"
      });
      right.append($("<div>").attr("id", "login"));
      var login = $("<script>").attr({
          "type": "in/Login",
          "data-onAuth": "onLinkedInAuth"
      }).css({
          "position": "relative",
          "top": "-30px"
      });
      right.append(login);

      $(container).append(left).append(right).append( $("<div>").css("clear", "both") );
    };


	LayoutManager.Logo["build"] = build;
})();
