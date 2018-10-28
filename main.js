'use strict';
var utils = require(__dirname + '/lib/utils'); // Get common adapter utils
var adapter = utils.Adapter('nello');

/*
 * internal libraries
 */
var library = require(__dirname + '/library.js');
var Nello = require(__dirname + '/nello.js');

/*
 * variables initiation
 */
var nello;
var settings = {
	decode: {
		key: 'hZTFui87HVG45shg$', // used for encrypted password
		fields: ['password']
	}
};


/*
 * ADAPTER UNLOAD
 *
 */
adapter.on('unload', function(callback)
{
    try
	{
        adapter.log.info('cleaned everything up...');
        callback();
    }
	catch(e)
	{
        callback();
    }
});

/*
 * ADAPTER READY
 *
 */
adapter.on('ready', function()
{
	// check if settings are set
	if (!adapter.config.client_id || !adapter.config.client_secret || !adapter.config.token_type || !adapter.config.access_token)
	{
		adapter.log.error('Client ID, client secret and / or token missing! Please go to settings and fill these in.');
		return;
	}
	
	nello = new Nello({'clientId': adapter.config.client_id, 'clientSecret': adapter.config.client_secret, 'tokenType': adapter.config.token_type, 'tokenAccess': adapter.config.access_token}, adapter);
	
	/*
	 * Get locations
	 */
	nello.getLocations(function(locations)
	{
		locations.forEach(function(location)
		{
			adapter.log.debug('Updating location: '+JSON.stringify(location));
			
			// extend address data
			location.address.streetName = location.address.street.trim();
			location.address.streetNumber = location.address.number;
			location.address.street = location.address.streetName + " " + location.address.streetNumber;
			location.address.address = location.address.streetName + " " + location.address.streetNumber + ", " + location.address.zip + " " + location.address.city;
			delete location.address.number;
			
			// create location as device
			adapter.createDevice(location.location_id, {name: location.address.address}, {}, function()
			{
				// write address information to channel
				adapter.createChannel(location.location_id, 'address', {}, {}, function()
				{
					for (var key in location.address)
					{
						library.createNode(adapter, {
								node: location.location_id + '.address.' + key,
								description: key
							},
							{val: location.address[key]}
						);
					}
				});
				
				// create node for the location id
				library.createNode(adapter, {
						node: location.location_id + '.id',
						description: 'ID of location ' + location.address.streetName
					},
					{val: location.location_id}
				);
				
				// create button to open the door
				library.createNode(adapter, {
						node: location.location_id + '.openDoor',
						description: 'Open door of location ' + location.address.streetName,
						common: {locationId: location.location_id, role: 'button', type: 'boolean'}
					},
					{val: false}
				);
				
				// attach listener
				adapter.subscribeStates(location.location_id + '.openDoor');
			});
		});
	});
});

/*
 * STATE CHANGE
 *
 */
adapter.on('stateChange', function(id, state)
{
	adapter.log.debug('State of ' + id + ' has changed ' + JSON.stringify(state) + '.');
	
	if (id.indexOf('openDoor') > -1)
	{
		var location = {};
		adapter.getObject(id, function(err, obj)
		{
			location.location_id = obj.common.locationId
			adapter.getState(location.location_id + '.address.address', function(err, state)
			{
				location.address = state.val;
				adapter.log.info('Triggered to open door of location ' + location.address + ' (' + location.location_id + ').');
				nello.openDoor(location.location_id);
			});
		});
	}
});