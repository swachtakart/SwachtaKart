'use strict';

angular.module('swachtakartmaps').run(['Menus', function (Menus) {
	// Set top bar menu items
 Menus.addMenuItem('topbar', {
		title: 'Swachtakartmaps',
		state: 'swachtakartmaps',
		type: 'dropdown',
	});
	// Add the dropdown list item
 Menus.addSubMenuItem('topbar', 'swachtakartmaps', {
		title: 'List Swachtakartmaps',
		state: 'swachtakartmaps.list'
	});

	// Add the dropdown create item
 Menus.addSubMenuItem('topbar', 'swachtakartmaps', {
		title: 'Create Swachtakartmap',
		state: 'swachtakartmaps.create',
	});
}
]);
