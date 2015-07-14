var requireNodeJsOnly = require;

var extend = function(Class) {
	class Export extends Class {
		constructor(...args) {
			super(...args);
			this.routesPath = "";
		}
		mount(callback) {
			if (this.routesPath === "") {
				return callback("You need to define the 'routesPath'!");
			}
			try {
				var directPath = process.cwd() + '/' + this.routesPath;
				requireNodeJsOnly('babel/register');
				this.Router = requireNodeJsOnly(directPath);
			} catch (err) {
				return callback(err);
			}
			var appText = "var unijs = require('unijs'); unijs.checkLocation.setClient(); var React = require('react'); var Router = require('react-router'); var routes = require('" + directPath + "'); Router.run(routes, Router.HistoryLocation, function (Handler) { React.render(<Handler/>, document.getElementById('main')); });";

			var srcPath = __dirname + '';
			var uniqName = this._path.split("/").join('#') + "_" + this._name;
			var appJSpath = __dirname + '/unijsBuild/' + uniqName + '.app.js';
			var bundleJSpath = __dirname + '/unijsBuild/' + uniqName + '.bundle.js';

         this._resources.push(bundleJSpath);

			var fs = requireNodeJsOnly("fs-extra");

			fs.outputFile(appJSpath, appText, function(err) {
				if (err) {
					return callback(err);
				}
				var browserify = requireNodeJsOnly("browserify");
				var babelify = requireNodeJsOnly("babelify");

				var bundleApp = function() {
					browserify({
							debug: true
						})
						.transform(babelify)
						.transform({
							global: true
						}, 'uglifyify')
						.require(appJSpath, {
							entry: true
						})
						.bundle()
						.on("error", function(err) {
							return callback(err);
						})
						.on("end", function() {
							super.mount(callback);
						})
						.pipe(fs.createWriteStream(bundleJSpath));
				};
			});
		}
	}

	return Export;
}

module.exports = {
	extend: extend
};
