( function ( mw ) {

	var moduleCollector = function runModuleCollector( data ) {
		var modulesTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'moduleslocalstorage.mustache' );

		return {
			summary: {},
			view: {
				name: 'performanceinspector-modules-localstorage-name',
				label: 'performanceinspector-modules-localstorage-label',
				template: modulesTemplate,
				data: {
					store: data.inspect.store
				}
			}
		};
	};

	module.exports.collectors.push( moduleCollector );
}( mediaWiki ) );
