<?php
/**
 * Hooks for PerformanceInspector extension
 *
 * @file
 * @ingroup Extensions
 */

class PerformanceInspectorHooks {
	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
		$title = $out->getTitle();
		if ( $title->inNamespace( NS_MAIN ) ) {
			$out->addModuleStyles( [ 'ext.PerformanceInspector.noscript' ] );
			$out->addModules( [ 'ext.PerformanceInspector.startup' ] );
		}
	}

	public static function onBaseTemplateToolbox( BaseTemplate $baseTemplate, array &$toolbox ) {
		$toolbox['performanceinspector'] = [
			'text' => $baseTemplate->getMsg( 'performanceinspector-portlet-link' )->text(),
			'href' => '#',
			'id' => 't-performanceinspector'
		];
	}

	public static function onResourceLoaderTestModules( array &$testModules,
		ResourceLoader &$resourceLoader
	) {
		$testModules['qunit']['ext.performanceInspector.tests'] = [
			'scripts' => [ 'tests/qunit/ext.performanceInspector.test.js' ],
			'dependencies' => [ 'ext.PerformanceInspector.analyze' ],
			'localBasePath' => __DIR__,
			'remoteExtPath' => 'PerformanceInspector'
		];
	}
}
