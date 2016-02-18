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

	public static function onBaseTemplateToolbox( BaseTemplate $baseTemplate, array &$toolbox ) {
			$toolbox['performanceinspector'] = array(
				'text' => $baseTemplate->getMsg( 'performanceinspector-portlet-link' )->text(),
				'href' => '#',
				'id' => 't-performanceinspector'
			);
		return true;
	}
}
