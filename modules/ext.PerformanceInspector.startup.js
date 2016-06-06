( function ( mw, $ ) {
	var $document = $( document ),
		inspectData;

	$document.ready( function () {
		var caPI,
			caPILink;

		function activatePI() {
			// Lets inspect the current page first, to make sure the result isn't
			// polluted by the modules in the performance inspector
			if ( !inspectData ) {
				inspectData = mw.loader.using( [ 'mediawiki.inspect' ] ).then( function () {
					return {
						// we want the largest module first
						modules: mw.inspect.reports.size(),
						css: mw.inspect.reports.css(),
						store: mw.inspect.reports.store()
					};
				} );
			}

			inspectData.then( function ( moduleData ) {
				$.when( mw.loader.using( [ 'ext.PerformanceInspector.analyze' ] ), $.ready ).then( function () {
					var collectors = mw.loader.require( 'ext.PerformanceInspector.analyze' ).collectors,
						views = [],
						summary = {},
						windowManager = new OO.ui.WindowManager(),
						promises = [],
						PiDialog = mw.loader.require( 'ext.PerformanceInspector.analyze' ).PiDialog,
						dialog;

					// for each collector object collect summary and view data and
					// pass it on to the dialog
					collectors.forEach( function ( collector ) {
						promises.push( collector( { inspect: moduleData } ) );
					} );
					// instead of Promise.all, is there a better way of doing it with jQuery?
					$.when.apply( $, promises ).then( function () {
						$.makeArray( arguments ).forEach( function ( data ) {
							if ( data.view ) {
								views.push( data.view );
								Object.keys( data.summary ).forEach( function ( summaryItem ) {
									summary[ summaryItem ] = data.summary[ summaryItem ];
								} );
							}
						} );
						dialog = new PiDialog( {
							size: 'larger'
						}, summary, views );

						$( 'body' ).append( windowManager.$element );
						windowManager.addWindows( [ dialog ] );
						windowManager.openWindow( dialog );
					} );
				} );
			} );
		}

		function onPIClick( e ) {
			e.preventDefault();
			activatePI();
		}

		caPI = $( '#t-performanceinspector' );
		caPILink = caPI.find( 'a' );
		caPI.on( 'click', onPIClick );
	} );

}( mediaWiki, jQuery ) );
