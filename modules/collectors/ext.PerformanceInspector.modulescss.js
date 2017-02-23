( function ( mw, $ ) {
	var moduleCollector = function runModuleCollector( data ) {
		var modulesTemplate;

		function toView( name, stats, index ) {
			return {
					name: name,
					selectors: mw.msg( 'performanceinspector-modules-css-used-selectors-values', stats.total !== 0 ?
							( stats.matched / stats.total * 100 ).toFixed( 2 ) + '%' : null, stats.matched, stats.total ),
					unmatchedSelectors: stats.unmatched,
					index: index
				};
		}
		function auditSelectors( css ) {
			var selectors = { total: 0, matched: 0, unmatched: [] },
					style = document.createElement( 'style' );
			style.textContent = css;
			document.body.appendChild( style );
			$.each( style.sheet.cssRules, function ( index, rule ) {
				// Only pickup CSSStyleRule
				if ( rule.selectorText !== undefined ) {
					selectors.total++;
					// document.querySelector() on prefixed pseudo-elements can throw exceptions
					// in Firefox and Safari. Ignore these exceptions.
					// https://bugs.webkit.org/show_bug.cgi?id=149160
					// https://bugzilla.mozilla.org/show_bug.cgi?id=1204880
					try {
						if ( document.querySelector( rule.selectorText ) !== null ) {
							selectors.matched++;
						} else {
							selectors.unmatched.push( rule.selectorText );
						}
					} catch ( e ) {}
				}
			} );
			document.body.removeChild( style );
			return selectors;
		}

		function cssResourceLoader() {
			var modules = [];
			$.each( data.inspect.modules, function ( index, mod ) {
					var css, stats, module = mw.loader.moduleRegistry[ mod.name ];
					try {
						css = module.style.css.join();
					} catch ( e ) { return; } // skip

					stats = auditSelectors( css );
					modules.push( toView( mod.name, stats, index ) );
				} );
			return modules;
		}

		// Not sure if we want this for the first release
		function cssFromURL() {
			var styles = document.styleSheets,
			cssFromFiles = [];

			$.each( styles, function ( index, style ) {
				var allStyles = '',
				stats;

				// we have styles from a link rel="stylesheet" href
				// it would be cool if we could separated inline CSS
				// from resource loaded CSS?
				if ( style.href ) {
					$.each( style.cssRules, function ( index, rule ) {
						allStyles += rule.cssText;
					} );

					stats = auditSelectors( allStyles );

					cssFromFiles.push( toView( style.href, stats, index ) );
				}
			} );

			return cssFromFiles;
		}
		modulesTemplate = mw.template.get( 'ext.PerformanceInspector.analyze', 'modulescss.mustache' );

		return {
			summary: {
			},
			view: {
				name: 'performanceinspector-modules-css-name',
				label: 'performanceinspector-modules-css-label',
				template: modulesTemplate,
				data: {
					cssResourceLoader: cssResourceLoader(),
					cssFromFiles: cssFromURL()
				}
			}
		};
	};

	module.exports.collectors.push( moduleCollector );
}( mediaWiki, jQuery ) );
