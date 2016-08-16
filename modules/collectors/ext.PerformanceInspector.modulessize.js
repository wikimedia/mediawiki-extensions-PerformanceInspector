( function ( mw, $ ) {

	var moduleCollector = function runModuleCollector( data ) {
		var totalSize = 0,
			barMetrics = [],
			modulesTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'modulessize.mustache' );

		function humanSize( bytes ) {
			var i = 0,
				units = [ '', ' KiB', ' MiB', ' GiB', ' TiB', ' PiB' ];

			if ( !$.isNumeric( bytes ) || bytes === 0 ) {
				return bytes;
			}
			for ( ; bytes >= 1024; bytes /= 1024 ) {
				i++;
			}
			// Maintain one decimal for kB and above, but don't
			// add ".0" for bytes.
			return bytes.toFixed( i > 0 ? 1 : 0 ) + units[ i ];
		}

		// Add the data needed for generating the bar chart
		data.inspect.modules.forEach( function ( module ) {
			if ( module.sizeInBytes !== null ) {
				barMetrics.push( {
					name: module.name,
					size: module.size,
					sizeInBytes: module.sizeInBytes
				} );
				totalSize += module.sizeInBytes;
			}
		} );

		function postProcess( html ) {
			var generate = mw.loader.require( 'ext.PerformanceInspector.analyze' ).barChart;
			generate( html, '.bar' );
		}
		return {
			summary: {
				modulesSummarySize: humanSize( totalSize )
			},
			view: {
				name: 'performanceinspector-modules-size-name',
				label: 'performanceinspector-modules-size-label',
				template: modulesTemplate,
				postProcess: postProcess,
				data: {
					modules: data.inspect.modules,
					series: barMetrics
				}
			}
		};
	};

	module.exports.collectors.push( moduleCollector );
}( mediaWiki, jQuery ) );
