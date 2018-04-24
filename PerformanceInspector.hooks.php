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
		$user = $out->getUser();

		if ( $title->inNamespace( NS_MAIN ) && $user->getOption( 'performanceinspector' ) ) {
			$out->addModuleStyles( [ 'ext.PerformanceInspector.noscript' ] );
			$out->addModules( [ 'ext.PerformanceInspector.startup' ] );
		}
	}

	public static function onBaseTemplateToolbox( BaseTemplate $baseTemplate, array &$toolbox ) {
		$user = RequestContext::getMain()->getUser();

		if ( $user->getOption( 'performanceinspector' ) ) {
			$toolbox['performanceinspector'] = [
				'text' => $baseTemplate->getMsg( 'performanceinspector-portlet-link' )->text(),
				'href' => '#',
				'id' => 't-performanceinspector'
			];
		}
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

	/**
	 * Handler for the GetPreferences hook.
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/GetPreferences
	 *
	 * @param \User $user
	 * @param array &$defaultPreferences
	 * @return bool
	 */
	public static function onGetPreferences( $user, &$defaultPreferences ) {
		$defaultPreferences['performanceinspector'] = [
			'type' => 'toggle',
			'label-message' => 'performanceinspector-pref-label',
			'help-message' => 'performanceinspector-pref-help',
			'section' => 'editing/developertools'
		];
		return true;
	}
}
