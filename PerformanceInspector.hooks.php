<?php
/**
 * Hooks for PerformanceInspector extension
 *
 * @file
 * @ingroup Extensions
 */

class PerformanceInspectorHooks {
	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {

		$action = $out->getRequest()->getVal( 'action' );
		$isEdit = ( $action === 'edit' );
		$title = $out->getTitle();
		if ( $title->inNamespace( NS_MAIN ) /*&& $isEdit*/ ) {
			$out->addModules( array( 'ext.PerformanceInspector.startup' ) );
		}
		return true;
	}
}
