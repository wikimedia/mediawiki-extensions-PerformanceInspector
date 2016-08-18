( function ( mw ) {

	var moduleCollector = function runModuleCollector( data ) {
		var
			modulesTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'modulescss.mustache' );

		return {
			summary: {
			},
			view: {
				name: 'performanceinspector-modules-css-name',
				label: 'performanceinspector-modules-css-label',
				template: modulesTemplate,
				data: {
					css: data.inspect.css
				}
			}
		};
	};

	module.exports.collectors.push( moduleCollector );
}( mediaWiki ) );
