exports.run = function( data, next ) {

	var Locale = require( 'express-locale' );
	var locale = Locale();

	data.messages = {};
	data.languages = {};
	
	var set_locale = function ( req, res, next ) {
		var selected_language = data.settings.default_language;
		var lang = req.url.substring( 1 );
		var i = lang.indexOf( '?' );
		if ( i >= 0 )
			lang = lang.substring( 0, i );
		if ( lang.length > 0 ) {
			if ( data.languages[ lang ] )
				selected_language = lang;
			req.locale.toString = function() {
				return selected_language;
			}
		}
		req.language = req.locale.toString();
		next();
	}
	
	data.app.use( locale );
	data.app.use( set_locale );
	
	data.load_languages = ( next ) => {
		data.sql.query( 'SELECT `name`, `label` from `languages` ORDER BY `order` ASC', [], ( err, results, fields ) => {
			
			if ( err ) {
				console.log( err );
			}
			else {
				data.languages = {};
				results.forEach( result => {
					data.languages[ result.name ] = result.label;
				});
				data.load_settings( next );
			}	
		});
	};
	data.load_languages( next );
}
