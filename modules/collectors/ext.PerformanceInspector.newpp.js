( function ( mw ) {

	var newppCollector = function runNewPPCollector() {
		var template = mw.template.get( 'ext.PerformanceInspector.analyze', 'newpp.mustache' );

		function generateMustacheView( parserReport ) {
			var limitReport = [],
				timingProfile = [],
				templates = parserReport.limitreport.timingprofile,
				i, j, data, holder, item;

			// Push the data for the limit report
			if ( parserReport.limitreport ) {
				Object.keys( parserReport.limitreport ).forEach( function ( key ) {
					if ( key !== 'timingprofile' ) {
						item = parserReport.limitreport[ key ];
						limitReport.push( { name:  mw.msg( 'performanceinspector-newpp-' + key ), value: item.limit ? mw.msg( 'performanceinspector-newpp-value-and-limit', item.value, item.limit ) : item } );
					}
				} );
			}

			// TODO we could either fix the raw data to be JSON or make this in a regexp as long
			// as we know the output pattern
			for ( i = 0; i < templates.length; i++ ) {
				data = templates[ i ].split( ' ' );
				holder = [];
				for ( j = 0; j < data.length; j++ ) {
					if ( data[ j ] !== '' ) {
						holder.push( data[ j ] );
					}
				}
				timingProfile.push( { name: holder[ 3 ], percentreal: holder[ 0 ], real: holder[ 1 ], calls: holder[ 2 ] } );
			}

			return { limitReport: limitReport,
				timingProfile: timingProfile,
				scribunto: parserReport.scribuntu,
				cacheReport: parserReport.cachereport
			};
		}

		return {
			summary: {
				parserReportSummary: mw.msg( 'performanceinspector-newpp-summary', mw.config.get( 'wgPageParseReport' ).limitreport.expensivefunctioncount.value )
			},
			view: {
				name: 'performanceinspector-newpp-name',
				label: 'performanceinspector-newpp-label',
				template: template,
				data: {
					report: generateMustacheView( mw.config.get( 'wgPageParseReport' ) )
				}
			}
		};
	};
	module.exports.collectors.push( newppCollector );
}( mediaWiki ) );
