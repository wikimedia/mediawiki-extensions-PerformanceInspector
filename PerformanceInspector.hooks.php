<?php
/**
 * Hooks for PerformanceInspector extension
 *
 * @file
 * @ingroup Extensions
 */

class PerformanceInspectorHooks {
	/**
	 * @param User $user
	 *
	 * @return bool
	 */
	private static function isBetaFeatureEnabled( User $user ) {
		return class_exists( 'BetaFeatures' )
			&& BetaFeatures::isFeatureEnabled( $user, 'performanceinspector' );
	}

	public static function onBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
		$title = $out->getTitle();
		$user = $out->getUser();

		if ( $title->inNamespace( NS_MAIN ) && self::isBetaFeatureEnabled( $user ) ) {
			$out->addModuleStyles( [ 'ext.PerformanceInspector.noscript' ] );
			$out->addModules( [ 'ext.PerformanceInspector.startup' ] );
		}
	}

	public static function onBaseTemplateToolbox( BaseTemplate $baseTemplate, array &$toolbox ) {
		$user = RequestContext::getMain()->getUser();

		if ( self::isBetaFeatureEnabled( $user ) ) {
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
	 * Handler for the GetBetaFeaturePreferences hook.
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/GetBetaFeaturePreferences
	 *
	 * @param User $user User to get preferences for
	 * @param array &$preferences Preferences array
	 *
	 * @return bool true in all cases
	 */
	public static function onGetBetaFeaturePreferences( User $user, array &$preferences ) {
		$preferences['performanceinspector'] = [
			'label-message' => 'performanceinspector-beta',
			'desc-message' => 'performanceinspector-beta-desc',
			'info-link' => 'https://www.mediawiki.org/wiki/Special:MyLanguage/' .
							'Extension:PerformanceInspector',
			'discussion-link' => 'https://www.mediawiki.org/wiki/' .
								'Extension_talk:PerformanceInspector',
			'requirements' => [
				'javascript' => true,
			]
		];

		return true;
	}
}
