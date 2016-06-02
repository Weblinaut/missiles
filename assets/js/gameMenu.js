var gameMenu = (function() {

	function bindHbsHelpers() {
		/*Handlebars.registerHelper('each', function(context, options) {
			var ret = "";

			for(var i=0, j=context.length; i<j; i++) {
				ret = ret + options.fn(context[i]);
			}

			return ret;
		});*/
	}

	function bindListeners() {

	}

	function init() {
		bindHbsHelpers();
		bindListeners();
	}

	return {
		init: init
	};

}());