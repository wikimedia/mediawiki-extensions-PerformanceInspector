( function ( mw, $ ) {

	var moduleCollector = function runModuleCollector( data ) {
		var totalSize = 0,
			series = [],
			labels = [],
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

		/**
		 * We use Chartist-js for the horizontal bars
		 * displaying the size of modules.
		 * https://gionkunz.github.io/chartist-js/
		 */
		function drawTheChart( labels, series ) {
			var chartDiv = $( '<div/>' );

			/*jshint nonew: false */
			new Chartist.Bar( chartDiv[ 0 ], {
				labels: labels,
				series: [ series ]
			}, {
				seriesBarDistance: 0,
				horizontalBars: true,
				height: labels.length * 30,
				width: 600,
				labelOffset: 20,
				axisY: {
					offset: 200
				}
			} );

			return chartDiv;
		}

		data.inspect.modules.forEach( function ( module ) {
			if ( module.sizeInBytes !== null ) {
				totalSize += module.sizeInBytes;
				series.push( module.sizeInBytes );
				labels.push( module.name + ' (' + module.size + ')' );
			}
		} );

		function postProcess( html, result ) {
			var chart = html.siblings( '#moduleChart' );
			chart.append( result.moduleChart );
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
				moduleChart: drawTheChart( labels, series ),
				postProcess: postProcess,
				data: {
					modules: data.inspect.modules,
					store: data.inspect.store,
					css: data.inspect.css
				}
			}
		};
	};

	module.exports.collectors.push( moduleCollector );
}( mediaWiki, jQuery ) );
