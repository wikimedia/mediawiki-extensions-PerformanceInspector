( function ( mw, $ ) {
	QUnit.module( 'ext.performanceInspector', QUnit.newMwEnvironment() );

	QUnit.test( 'Test that always succeeds', 1, function ( assert ) {
		assert.strictEqual( true, true, 'yay' );
	} );

}( mediaWiki, jQuery ) );
