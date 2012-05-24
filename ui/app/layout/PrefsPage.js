"use strict";

var LayoutManager = LayoutManager || {};
LayoutManager.PrefsPage = {};

(function() {
	var build = function(container) {
    
      $(container).css({
        "background" : "url(images/prefs.png) right bottom no-repeat"
      });


      var buildTitle = function(titlu) {
        var p = $("<h1>").addClass("pref-titlu").append(titlu);
        var line = $("<div>");
        return ($("<div>").append(p).append(line))[0];
      };
	

      $(container).append( buildTitle("Notificari") );
      $(container).append( $("<p>").addClass("pref-subtitlu")
        .append("Cat de des doresti sa primesti notificari cu job-uri noi care ti se potrivesc ?") );
      
      var radio = $("<div>").css({"position": "relative", "left": "80px", "top": "20px"}).append( 
        $("<input>").attr({"type": "radio", "id": "niciodata", "name": "notif"}) ).append(
        $("<label>").attr("for", "niciodata").append("niciodata")).append(
        $("<input>").attr({"type": "radio", "id": "zilnic", "name": "notif"}) ).append(
        $("<label>").attr("for", "zilnic").append("zilnic")).append(
        $("<input>").attr({"type": "radio", "id": "saptamanal", "name": "notif"}) ).append(
        $("<label>").attr("for", "saptamanal").append("saptamanal")).append(
        $("<input>").attr({"type": "radio", "id": "bilunar", "name": "notif"}) ).append(
        $("<label>").attr("for", "bilunar").append("bilunar")).append(
        $("<input>").attr({"type": "radio", "id": "lunar", "name": "notif"}) ).append(
        $("<label>").attr("for", "lunar").append("lunar"));
      
      $(container).append(radio);
      radio.buttonset();


      $(container).append( buildTitle("LinkedIn") );
      var linkedinButton = $("<button>").append("LinkedIn");
      $(container).append( $("<p>").addClass("pref-subtitlu")
        .append("Acceseaza contul tau de    ").append(linkedinButton) );
      linkedinButton.button();
      linkedinButton.find("span").css("font-size", "12px");

      $(container).append( buildTitle("CV") );
      var resetCVButton = $("<button>").append("Reseteaza");
      $(container).append( $("<p>").addClass("pref-subtitlu").append(resetCVButton)
        .append("   modificarile facute asupra CV-ului"));
      resetCVButton.button();
      resetCVButton.find("span").css("font-size", "12px");
      $(resetCVButton).click(function(){
				
		$.ajax({
		"url": window.hostname + "/api/cv/refresh/",
		"async": true,
		"type": "post",
		"data": {"content": ""},
		"success": function (data, textStatus, jqXHR) {
			if (typeof(data) == "string") {
				pageAPI.cvInputAPI.setCV(JSON.parse(data));
			}
			else {
				window.console.error("Rezultat aiurea");
			}
		},
		"error": function(jqXHR, textStatus, errorThrown) {
			window.console.log("A crapat : " + errorThrown);
		}
		});

	});


      linkedinButton.click(function() {
        window.open("http://www.linkedin.com", "_blank");
      });
}
		LayoutManager.PrefsPage["build"] = build;

})();
