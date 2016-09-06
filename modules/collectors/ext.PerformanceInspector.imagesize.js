( function ( mw, $ ) {
	/**
	  	Collect image information. Make a ajax request per image and check the size from the response header.
			In the future lets use the ResourceTiming API to fetch size for images, that will make
			the inspector faster. We did try it out but Firefox has a bug where local cached assets
			are not included, meaning using it we would miss images for Firefox users:
			https://bugzilla.mozilla.org/show_bug.cgi?id=1113676
	*/
	var imageSizeCollector = function runImageSizeCollector() {
		var warningLimitInBytes = 1000000,
			totalSize = 0,
			warnings = 0,
			maxImageNameLength = 60,
			images = [],
			humanSize = module.exports.humanSize;

		function getImageName( name ) {
			if ( name.length > maxImageNameLength ) {
				return name.substr( 0, maxImageNameLength - 1 );
			}
			return name;
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
				if ( img[ i ].currentSrc && img[ i ].currentSrc.indexOf( 'data:image' ) === -1  ) {
					promises.push( fetchContent( img[ i ].currentSrc ) );
				}
			}

			$.when.apply( $, promises ).done( function () {
						var values = arguments,
						sizeRaw,
						i;
						for ( i = 0; i < values.length; i++ ) {
							sizeRaw = Number( values[ i ].contentLength );
							images.push( {
									name: getImageName( values[ i ].url.substring( values[ i ].url.lastIndexOf( '/' ) + 1 ) ),
									url: values[ i ].url,
									sizeRaw: sizeRaw,
									size: humanSize( sizeRaw ),
									warning: values[ i ].contentLength > warningLimitInBytes ? true : false
								} );

							totalSize += sizeRaw;
						}
						images.sort( function ( a, b ) { return b.sizeRaw - a.sizeRaw;} );
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
