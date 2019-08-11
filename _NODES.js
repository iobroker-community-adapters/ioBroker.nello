module.exports =
{
	// address
	'address.fullAddress': {role: 'text', description: 'Full address of the location'},
	'address.address': {role: 'text', description: 'Address of the location'},
	'address.city': {role: 'text', description: 'City of the location'},
	'address.country': {role: 'text', description: 'Country of the location'},
	'address.state': {role: 'text', description: 'State  of the location'},
	'address.street': {role: 'text', description: 'Street with number of the location'},
	'address.streetName': {role: 'text', description: 'Street name of the location'},
	'address.streetNumber': {role: 'text', description: 'Street number of the location'},
	'address.zip': {role: 'text', description: 'ZIP code of the location'},

	// timeWindows
	'timeWindows.enabled': {role: 'indicator', description: 'State whether time window is enabled'},
	'timeWindows.icalObj': {role: 'json', description: 'Object of the calendar data'},
	'timeWindows.icalRaw': {role: 'text', description: 'Text of the calendar data in iCal format'},
	'timeWindows.id': {role: 'id', description: 'ID of the time window'},
	'timeWindows.image': {role: 'disabled', description: '(not in used)'},
	'timeWindows.name': {role: 'text', description: 'Name of the time window'},
	'timeWindows.state': {role: 'indicator', description: 'State'}
};