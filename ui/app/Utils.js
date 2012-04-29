"use strict";

var Utils = (function() {
	
	var isObject = function(reference) {
		return typeof(reference) == "object";
	};

	var copyPropertiesInObject = function(source, destination) {
		if ((isObject(source) && isObject(destination)) == false) {
			window.console.warn("Could not copy properties in object.");
			window.console.trace();
			return;
		}
		
		for (var key in source) {
			if (source.hasOwnProperty(key) && destination.hasOwnProperty(key) == false) {
				destination[key] = source[key];
			}
		}
	};
	
	return {
		isObject:isObject,
		copyPropertiesInObject:copyPropertiesInObject
	};
	
})();

