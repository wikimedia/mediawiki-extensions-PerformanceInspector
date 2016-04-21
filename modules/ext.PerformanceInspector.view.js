/*jshint undef:false */
( function ( mw, $ ) {

	var PerformanceDialog = function PiDialog( config, summary, views ) {
		PerformanceDialog.super.call( this, config );
		this.summary = summary;
		this.views = views;
	};

	OO.inheritClass( PerformanceDialog, OO.ui.ProcessDialog );

	PerformanceDialog.static.title = OO.ui.deferMsg( 'performanceinspector-dialog-title' );

	PerformanceDialog.static.actions = [ {
		action: 'done',
		label: mw.msg( 'performanceinspector-dialog-cancel' ),
		flags: [ 'safe' ]
	} ];

	function PerformanceInspectorResult( name, config ) {
		config = $.extend( {}, config );
		PerformanceInspectorResult.parent.apply( this, arguments );
		this.label = config.label;
		this.icon = config.icon;
		if ( this.$element.is( ':empty' ) ) {
			this.$element.text( this.label );
		}
	}
	OO.inheritClass( PerformanceInspectorResult, OO.ui.PageLayout );
	PerformanceInspectorResult.prototype.setupOutlineItem = function ( outlineItem ) {
		PerformanceInspectorResult.parent.prototype.setupOutlineItem.call( this, outlineItem );
		this.outlineItem
			.setMovable( true )
			.setRemovable( true )
			.setIcon( this.icon )
			.setLabel( this.label );
	};

	PerformanceDialog.prototype.initialize = function () {
		var self = this,
			summaryTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'summary.mustache' ),
			/**
			 * Help method for getting text messages
			 * in mustache templates.
			 */
			messageFunction = function () {
				return function ( text ) {
					return mw.msg( text );
				};
			};

		PerformanceDialog.parent.prototype.initialize.apply( this, arguments );
		this.bookletLayout = new OO.ui.BookletLayout( {
			outlined: true,
			continuous: true
		} );

		this.pages = [];
		this.summary.msg = messageFunction;

		$summary = summaryTemplate.render( this.summary );

		this.pages.push( new PerformanceInspectorResult( mw.msg( 'performanceinspector-dialog-summary' ), {
			label: mw.msg( 'performanceinspector-dialog-summary' ),
			icon: 'info',
			content: [ $summary, '' ]
		} ) );

		// parse the templates and data we get from each info and convert the
		// to pages
		self.views.forEach( function ( result ) {
			result.data.msg = messageFunction;

			$parsedHTML = result.template.render( result.data );
			// if the info has some post processing to be done on the HTML
			// lets do it (= inject graphs)
			if ( result.postProcess ) {
				result.postProcess( $parsedHTML, result );
			}

			self.pages.push( new PerformanceInspectorResult( mw.msg( result.name ), {
				label: mw.msg( result.label ),
				icon: result.icon || 'info',
				content: [ $( '<h3>' ).text( mw.msg( result.name ) ), $parsedHTML ]
			} ) );
		} );

		this.bookletLayout.addPages( this.pages );
		this.$body.append( this.bookletLayout.$element );
	};

	PerformanceDialog.prototype.getBodyHeight = function () {
		return 350;
	};

	PerformanceDialog.prototype.getActionProcess = function ( action ) {
		if ( action ) {
			return new OO.ui.Process( function () {
				this.close( {
					action: action
				} );
			}, this );
		}
		return PerformanceDialog.parent.prototype.getActionProcess.call( this, action );
	};

	PerformanceDialog.prototype.getSetupProcess = function ( data ) {
		return PerformanceDialog.parent.prototype.getSetupProcess.call( this, data )
			.next( function () {
				this.bookletLayout.setPage( 'summary' );
			}, this );
	};

	mw.performanceInspector.dialog = {};
	mw.performanceInspector.dialog.PiDialog = PerformanceDialog;

}( mediaWiki, jQuery ) );