function onLinkedInLoad() {
  IN.Event.on(
    IN
    , "auth"
    , function() {
      Instant().onAuth();
    }
  );
};

Instant = (function() {
  var instance = null;

  function Singleton() {
    this.isLoggedIn = false;

    this.onAuth = function() {
      IN.API.Profile("me").result(
        function(profile) {
          showMsg(profile, true);
        }
      ).error(
        function(profile) {
          showMsg(profile, false);
        }
      );
    };

    this.doLogout = function() {
      this.isLoggedIn = false;
      $("#login").empty();
      IN.User.logout();

      $.ajax({
          "url" : window.hostname + "/logout",
          "async" : true,
          "type" : "post",
          "data" : {"content" : ""},
          "succes" : function(data, textStatus, jqXHR) {
              window.console.log("logout OK");
          },
          "error": function(jqXHR, textStatus, errorThrown) {
              window.console.log("error logout");
          }
      });
    };

    function showMsg(profile, isSuccess) {
      if (isSuccess) {
        Instant().isLoggedIn = true;

        var msg = "";
        $.ajax({
            "url" : window.hostname + "/api/profile_pic/",
            //"async" : true,
            "type" : "post",
            "data" : {"content" : ""},
            "success" : function(data, textStatus, jqXHR) {
                if (data.length == 0) data = window.hostname + "/images/photo.jpg";
                msg = "<div style='float:left; margin-top:20px'> <strong style='float:left'>"
                + profile.values[0].firstName
                + " "
                + profile.values[0].lastName
                + "</strong> <br/>"
                + "&nbsp;[<a onclick='Instant().doLogout();' style='color:red'>Deconectare</a>]"
                + "</div>"
                + "<img src=" + data + " height='50%' style='margin-left:10px; margin-top:10px; border-style:solid; border-width:1px; border-color:white'></img>"
                $("#login").append(msg);
                $("#login").css({"font-size" : "15px"});
                window.getCV();
                window.console.log(msg);
                window.console.log("profile pic ok");
            },
            "error" : function(jqXHR, textStatus, errorThrown) {
                var d = window.hostname + "/images/photo.jpg";
                msg = "<div style='float:left; margin-top:20px'> <strong style='float:left'>"
                + profile.values[0].firstName
                + " "
                + profile.values[0].lastName
                + "</strong> <br/>"
                + "&nbsp;[<a onclick='Instant().doLogout();' style='color:red'>Deconectare</a>]"
                + "</div>"
                + "<img src=" + d + " height='50%' style='margin-left:10px; margin-top:10px; border-style:solid; border-width:1px; border-color:white'></img>"
                $("#login").append(msg);
                $("#login").css({"font-size" : "15px"});
                window.getCV();
                window.console.log(msg);
                window.console.log("error profile pic");
            }
        });

      } else {
        msg = "Sorry, an error has occured in logging in.  Please try again.";
        window.console.log(msg);
      }
    };
  };

  return function() {
    if (instance == null) {
      instance = new Singleton();

      instance.prototype = {
        getInstance: function() {
          if (instance == null) {
            instance = new Singleton();
            instance.constructor = null;
          }
          return instance;
        }
      };

      instance.constructor = null;
    }

    return instance;
  };
})();
