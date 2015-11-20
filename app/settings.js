import angular from 'angular';

module.exports = angular.module('app.settings', [])

	.factory('Settings', () => {
		return {
			appName: "DeskopApp",
			appExporterExt: 'daf'
		};
	});