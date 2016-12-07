'use strict';

angular.module('swachtaprojects').run(['Menus', function (Menus) {
	// Set top bar menu items
 Menus.addMenuItem('topbar', {
		title: 'Swachta Projects',
		state: 'swachtaprojects',
		type: 'dropdown',
	});
	// Add the dropdown list item
 Menus.addSubMenuItem('topbar', 'swachtaprojects', {
		title: 'All Projects',
		state: 'swachtaprojects.list'
	});

	// Add the dropdown create item
 Menus.addSubMenuItem('topbar', 'swachtaprojects', {
		title: 'Create Project',
		state: 'swachtaprojects.create',
	});
}
]);

