/*jshint undef:false */
( function ( mw, $ ) {
	var $document = $( document );

	$document.ready( function () {

		function activatePI() {
			// Lets inspect the current page first, to make sure the result isn't
			// polluted by the modules in the performance inspector
			mw.loader.using( [ 'mediawiki.inspect' ] ).done( function () {

				mw.performanceInspector = {};
				mw.performanceInspector.info = [];
				// TODO this isn't correct because the second interaction
				// it will pickup the Performance Inspectors metrics
				mw.performanceInspector.inspect = {
					modules: mw.inspect.reports.size(),
					css: mw.inspect.reports.css(),
					store: mw.inspect.reports.store()
				};

				$.when(
					mw.loader.using( [ 'ext.PerformanceInspector.analyze' ] ),
					$.ready
				).done( function () {
					var views = [],
						summary = {},
						windowManager = new OO.ui.WindowManager();
					// for each info object collect summary and view data and
					// pass it on to the dialog
					mw.performanceInspector.info.forEach( function ( info ) {
						var data = info();
						if ( data.view ) {
							views.push( data.view );
							Object.keys( data.summary ).forEach( function ( summaryItem ) {
								summary[ summaryItem ] = data.summary[ summaryItem ];
							} );
						}
					} );
					piDialog = new mw.performanceInspector.dialog.PiDialog( {
							size: 'larger'
						},
						summary,
						views );

					$( 'body' ).append( windowManager.$element );
					windowManager.addWindows( [ piDialog ] );
					windowManager.openWindow( piDialog );
				} );
			} );
		}

		function onPIClick( e ) {
			e.preventDefault();
			activatePI();
		}

		$caPI = $( '#t-performanceinspector' );
		$caPILink = $caPI.find( 'a' );

		$caPI.on( 'click', onPIClick );
	} );
}( mediaWiki, jQuery ) );
