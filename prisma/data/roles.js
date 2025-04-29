const roles = [
	{
		slug: 'admin',
		isProtected: true,
		name: 'Admin',
		description: 'Administrator with full access to the system.',
	},
	{
		slug: 'core',
		isProtected: true,
		isDefault: true,
		name: 'Core',
		description: 'Core with permissions to manage the system.',
	},
	{
		slug: 'parent',
		name: 'Parent',
		description: 'Parent with permissions to manage own kids.',
	},
	{
		slug: 'volunteer',
		name: 'Volunteer',
		description: 'Volunteer member with limited access to specific operational tasks.',
	}
];

module.exports = roles;
