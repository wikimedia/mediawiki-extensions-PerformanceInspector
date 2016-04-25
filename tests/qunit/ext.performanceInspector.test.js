( function ( mw, $ ) {
	QUnit.module( 'ext.performanceInspector', QUnit.newMwEnvironment() );

	QUnit.test( 'Test collector structure', function ( assert ) {
				var collectors = require( 'ext.PerformanceInspector.analyze' ).collectors,
				promises = [],
				dummyModuleData = {
						inspect: {
							modules: [ {
								name: 'ext.centralauth.centralautologin',
								size: '1.8 KiB',
								sizeInBytes: 1830
							} ],
							css: [ {
								allSelectors: 262,
								matchedSelectors: 11,
								module: 'site',
								percentMatched: '4.20%'
							} ],
							store: [ {
								enabled: true,
								expired: 2,
								hits: 98,
								misses: 3,
								totalSize: '1.4 MiB'
							} ]
						}
					};

				assert.ok( collectors.length > 0, 'We should pick up the collectors' );

				collectors.forEach( function ( collector ) {
					promises.push( collector( dummyModuleData ) );
				} );

				// instead of Promise.all, is there a better way of doing it with jQuery?
				$.when.apply( $, promises ).then( function () {
					$.makeArray( arguments ).forEach( function ( result ) {
						var name = result.view && result.view.name ? result.view.name : 'unknown';
						assert.ok( result.view, 'Each collector should produce a view ' + name );
						assert.ok( result.view.name, 'Each view should have a name ' + name );
						assert.ok( result.view.label, 'Each view should have a label ' + name );
						assert.ok( result.view.template, 'Each view should have a mustache template ' + name );
						assert.ok( result.view.data, 'Each view should have some data to show ' + name );
						assert.ok( result.summary, 'Each collector should produce a summary ' + name );
					} );
				} );
			} );

}( mediaWiki, jQuery ) );
