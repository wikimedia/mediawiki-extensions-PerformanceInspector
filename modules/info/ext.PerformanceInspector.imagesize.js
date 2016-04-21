/*jshint undef:false */

( function ( mw, $ ) {

	var imageSizeMetrics = function generateImageSize() {
		var warningLimit = 6000,
			totalSize = 0,
			warnings = 0,
			images = [],
			resources,
			imageSizeTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'imagesize.mustache' ),
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
					totalSize += resources[ i ].encodedBodySize;
					if ( resources[ i ].encodedBodySize > warningLimit ) {
						warnings++;
					}
					images.push( {
						name: resources[ i ].name.substring( resources[ i ].name.lastIndexOf( '/' ) + 1 ),
						url: resources[ i ].name,
						size: humanSize( resources[ i ].encodedBodySize ),
						warning:  resources[ i ].encodedBodySize > warningLimit ? true : false
					} );
				}
			}

			return {
				summary: {
					imagesSummary: mw.msg( 'performanceinspector-modules-summary-images', images.length, humanSize( totalSize ), warnings )
				},
				view: {
					name: 'performanceinspector-imagesize-name',
					label: 'performanceinspector-imagesize-label',
					template: imageSizeTemplate,
					data: {
						totalImageSize: totalSize,
						warningLimit: warningLimit,
						images: images
					}
				}
			};
		} else {
			return {};
		}
	};
	mw.performanceInspector.info.push( imageSizeMetrics );
}( mediaWiki, jQuery ) );
