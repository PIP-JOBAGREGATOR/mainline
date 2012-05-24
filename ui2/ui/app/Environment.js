"use strict";

var Environment = (function() {
	var windowWidth = null;
	var windowHeight = null;
	var ua = null;
	
	var collectInfo = function() {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
	};
	
	var getWindowWidth = function() {
		return windowWidth;
	};
	
	var getWindowHeight = function() {
		return windowHeight;
	};
	
	var getUserAgent = function() {
		return ua;
	};
	
	var isWebKit = function() {
		return false;
	};
	
	var isGecko = function() {
		return false;
	};
	
	return {
		collectInfo: collectInfo,
		getWindowWidth: getWindowWidth,
		getWindowHeight: getWindowHeight,
		getUserAgent: getUserAgent,
		isWebKit: isWebKit,
		isGecko: isGecko
	};
})();