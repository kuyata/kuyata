import angular from 'angular';

export default angular.module('app.settings', [])

	.factory('Settings', () => {
		return {
			appName: "DeskopApp",
			appExporterExt: 'daf'
		};
	});