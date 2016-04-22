( function ( mw, $ ) {
	/**
	  	Collect image information. W make a ajax request per image and check the size from the response header.
	*/
	var imageSizeCollector = function runImageSizeCollector() {
		var warningLimitInBytes = 1000000,
			totalSize = 0,
			warnings = 0,
			maxImageNameLength = 60,
			images = [];

		function getImageName( name ) {
			if ( name.length > maxImageNameLength ) {
				return name.substr( 0, maxImageNameLength - 1 );
			}
			return name;
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

		function fetchUsingAjax() {
			var deferred = new $.Deferred(),
			img = document.getElementsByTagName( 'img' ),
			promises = [],
			i;
			function fetchContent( url ) {
				return $.ajax( {
						url: url
					} ).then( function ( data, textStatus, jqXHR ) {
						return {
							url: url,
							contentLength: jqXHR.getResponseHeader( 'Content-Length' )
						};
					} );
			}

			for ( i = 0; i < img.length; i++ ) {
				if ( img[ i ].currentSrc ) {
					promises.push( fetchContent( img[ i ].currentSrc ) );
				}
			}

			$.when.apply( $, promises ).done( function () {
						var values = arguments,
						i;
						for ( i = 0; i < values.length; i++ ) {
							images.push( {
								name: getImageName( values[ i ].url.substring( values[ i ].url.lastIndexOf( '/' ) + 1 ) ),
								url: values[ i ].url,
								size: humanSize( values[ i ].contentLength ),
								warning: values[ i ].contentLength > warningLimitInBytes ? true : false
							} );

							totalSize += Number( values[ i ].contentLength );
						}
						deferred.resolve( {
							summary: {
								imagesSummary: mw.msg( 'performanceinspector-modules-summary-images', images.length, humanSize( totalSize ), warnings )
							},
							view: {
								name: 'performanceinspector-imagesize-name',
								label: 'performanceinspector-imagesize-label',
								template: mw.template.get( 'ext.PerformanceInspector.analyze', 'imagesize.mustache' ),
								data: {
									totalImageSize: totalSize,
									images: images
								}
							}
						} );
					} );
			return deferred.promise();
		}

		return fetchUsingAjax();

	};
	module.exports.collectors.push( imageSizeCollector );
}( mediaWiki, jQuery ) );
