( function ( mw ) {

	var moduleCollector = function runModuleCollector( data ) {
		var modulesTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'moduleslocalstorage.mustache' );

		function humanSize( bytes ) {
			var i = 0,
				units = [ 'size-bytes', 'size-kilobytes','size-megabytes', 'size-gigabytes' ];

			if ( !$.isNumeric( bytes ) || bytes === 0 ) {
				return bytes;
			}
			for ( ; bytes >= 1024; bytes /= 1024 ) {
				i++;
			}
			// Maintain one decimal for kB and above, but don't
			// add ".0" for bytes.
			return mw.msg( units[ i ], bytes.toFixed( i > 0 ? 1 : 0 ) ) ;
		}

		return {
			summary: {},
			view: {
				name: 'performanceinspector-modules-localstorage-name',
				label: 'performanceinspector-modules-localstorage-label',
				template: modulesTemplate,
				data: {
					store: {
						enabled: data.inspect.store.enabled,
						hits: data.inspect.store.hits,
						misses: data.inspect.store.misses,
						expired: data.inspect.store.expired,
						totalSize: humanSize( data.inspect.store.totalSizeInBytes )
					}
				}
			}
		};
	};

	module.exports.collectors.push( moduleCollector );
}( mediaWiki ) );
