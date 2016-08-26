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
			$out->addModuleStyles( [ 'ext.PerformanceInspector.noscript' ] );
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

	public static function onResourceLoaderTestModules( array &$testModules,
		ResourceLoader &$resourceLoader ) {
		$testModules['qunit']['ext.performanceInspector.tests'] = array(
			'scripts' => array( 'tests/qunit/ext.performanceInspector.test.js' ),
			'dependencies' => array( 'ext.PerformanceInspector.analyze' ),
			'localBasePath' => __DIR__,
			'remoteExtPath' => 'PerformanceInspector'
		);
		return true;
	}
}
