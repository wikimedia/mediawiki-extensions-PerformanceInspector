/*jshint undef:false */

( function ( mw, $ ) {

	var pageSizeMetrics = function generatePageSize() {
		var warningLimit = 4000,
			noOfImages = 0,
			tooBig = [],
			resources,
			size = {
				images: 0,
				html: 0,
				others: 0
			},
			pageSizeTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'pagesize.mustache' ),
			isResourceTimingV2Supported = ( window.performance && window.performance.getEntriesByType( 'resource' ) && window.performance.getEntriesByType( 'resource' )[ 0 ].encodedBodySize );

		function isImage( name ) {
			return ( name.match( /\.(jpeg|jpg|gif|png)$/i ) !== null );
		}

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

		// The browser supports Resource Timing V2
		if ( isResourceTimingV2Supported ) {
			resources = window.performance.getEntriesByType( 'resource' );

			for ( i = 0; i < resources.length; i++ ) {
				if ( isImage( resources[ i ].name ) ) {
					size.images = size.images + resources[ i ].encodedBodySize;
					noOfImages++;
					if ( resources[ i ].encodedBodySize > warningLimit ) {
						tooBig.push( {
							name: resources[ i ].name.substring( resources[ i ].name.lastIndexOf( '/' ) + 1 ),
							size: humanSize( resources[ i ].encodedBodySize )
						} );
					}
				} else {
					size.others = size.others + resources[ i ].encodedBodySize;
				}
			}

			return {
				summary: {
					pageSize: humanSize( size.images + size.html + size.others )
				},
				view: {
					name: 'performanceinspector-pagesize-name',
					label: 'performanceinspector-pagesize-label',
					template: pageSizeTemplate,
					data: {
						size: {
							images: humanSize( size.images ),
							html: humanSize( size.html ),
							others: humanSize( size.others )
						},
						warningLimit: warningLimit,
						totalSize: humanSize( size.images + size.html + size.others ),
						tooBig: tooBig,
						showToBig: tooBig.length > 0 ? true : false,
						noOfImages: noOfImages
					}
				}
			};
		} else {
			return {};
		}
	};
	mw.performanceInspector.info.push( pageSizeMetrics );
}( mediaWiki, jQuery ) );
