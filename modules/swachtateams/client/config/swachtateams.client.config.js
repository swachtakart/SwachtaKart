'use strict';

angular.module('swachtateams').run(['Menus', function (Menus) {
	// Set top bar menu items
 Menus.addMenuItem('topbar', {
		title: 'Swachta Team',
		state: 'swachtateams',
		type: 'dropdown',
	});
	// Add the dropdown list item
 Menus.addSubMenuItem('topbar', 'swachtateams', {
		title: 'My Team',
		state: 'swachtakartmaps.list'
	});

	// Add the dropdown create item
 Menus.addSubMenuItem('topbar', 'swachtateams', {
		title: 'Create Team',
		state: 'swachtateams.create',
	});
}
]);

