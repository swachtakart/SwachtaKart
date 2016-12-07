'use strict';

angular.module('swachtamaps').run(['Menus', function (Menus) {
	// Set top bar menu items
 Menus.addMenuItem('topbar', {
		title: 'Swachta Map',
		state: 'swachtamaps',
		type: 'dropdown',
	});
	// Add the dropdown list item
 Menus.addSubMenuItem('topbar', 'swachtamaps', {
		title: 'My Map',
		state: 'swachtamaps.list'
	});

	// Add the dropdown create item
 Menus.addSubMenuItem('topbar', 'swachtamaps', {
		title: 'Add On Map',
		state: 'swachtamaps.create',
	});
}
]);

