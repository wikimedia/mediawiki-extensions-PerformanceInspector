( function ( mw, $ ) {

	var moduleCollector = function runModuleCollector( data ) {
		var totalSize = 0,
			barMetrics = [],
			topThree = data.inspect.modules.slice( data.inspect.modules.length - 3, data.inspect.modules.length ).reverse(),
			modulesTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'modules.mustache' );

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
		data.inspect.modules.reverse().forEach( function ( module ) {
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
				modulesSummary: topThree,
				modulesSummarySize: humanSize( totalSize )
			},
			view: {
				name: 'performanceinspector-modules-name',
				label: 'performanceinspector-modules-label',
				template: modulesTemplate,
				postProcess: postProcess,
				data: {
					modules: data.inspect.modules,
					store: data.inspect.store,
					css: data.inspect.css,
					series: barMetrics
				}
			}
		};
	};

	module.exports.collectors.push( moduleCollector );
}( mediaWiki, jQuery ) );
