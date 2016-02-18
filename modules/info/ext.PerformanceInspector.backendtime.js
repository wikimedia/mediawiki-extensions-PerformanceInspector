/*jshint undef:false */
( function ( mw ) {
	/**
	This is an example of what the backend time could look like, it is not finished
	*/
	// the backend times variance alot depending where you are in the world
	var backendMetrics = function generateBackendTime() {
		var backendTime = window.performance.timing.responseStart - window.performance.timing.navigationStart,
			limit = 300,
			backendTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'backendtime.mustache' ),
			summaryMessage = '';

		if ( backendTime > limit ) {
			summaryMessage = mw.msg( 'performanceinspector-backendtime-summary-above-medium', backendTime );
		}
		return {
			summary: {
				backendTime: summaryMessage
			},
			view: {
				name: 'performanceinspector-backendtime-name',
				label: 'performanceinspector-backendtime-label',
				template: backendTemplate,
				data: {
					backendTime:  mw.msg( 'performanceinspector-backendtime-time-spent', backendTime )
				}
			}
		};
	};

	mw.performanceInspector.info.push( backendMetrics );

}( mediaWiki ) );
