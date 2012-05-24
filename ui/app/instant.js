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
          "url" : "https://192.168.1.105:8443/logout",
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
        msg = "Welcome to Jobotron, <strong>"
          + profile.values[0].firstName
          + " "
          + profile.values[0].lastName
          + "</strong> [<a onclick='Instant().doLogout();' href='#'>Sign Out</a>]"

        $("#login").append(msg);
        $("#login").css({"font-size" : "15px"});
        window.console.log(msg);
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
