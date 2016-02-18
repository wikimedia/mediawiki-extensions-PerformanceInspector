/*jshint undef:false */
( function ( mw, $ ) {

	var moduleMetrics = function generateModulesMetrics() {

		var totalSize = 0,
			series = [],
			labels = [],
			topThree = mw.performanceInspector.inspect.modules.slice( 0, 3 ),
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
			$chartDiv = $( '<div/>' );
			/*	$chartDiv = $( '<div/>', {
					id: 'modulesChart'
				} );
*/
			// We need to discuss how to handle the bars on a small device
			// Chartist is responsive + we could set our own breakpoints.
			// One thing that's wrong today is that we we set the width/height,
			// instead we should trigger an update when the dialog is open
			// __chartist__.update();
			// but where is the best place to jack it in?

			/*jshint nonew: false */
			new Chartist.Bar(  $chartDiv[ 0 ], {
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

			return $chartDiv;
		}

		mw.performanceInspector.inspect.modules.reverse().forEach( function ( module ) {
			if ( module.sizeInBytes !== null ) {
				totalSize += module.sizeInBytes;
				series.push( module.sizeInBytes );
				labels.push( module.name + ' (' + module.size + ')' );
			}
		} );

		function postProcess( html, result ) {
			$chart = html.siblings( '#moduleChart' );
			$chart.append( result.moduleChart ) ;
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
					modules: mw.performanceInspector.inspect.modules,
					store: mw.performanceInspector.inspect.store,
					css: mw.performanceInspector.inspect.css
				} }
		};
	};
	mw.performanceInspector.info.push( moduleMetrics );

}( mediaWiki, jQuery ) );
