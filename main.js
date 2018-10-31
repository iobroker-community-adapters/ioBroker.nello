'use strict';
const utils = require(__dirname + '/lib/utils'); // Get common adapter utils
const adapter = utils.Adapter('nello');

/*
 * internal libraries
 */
const Library = require(__dirname + '/library.js');
const Nello = require(__dirname + '/nello.js');

/*
 * variables initiation
 */
var library;
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
	
	library = new Library(adapter);
	nello = new Nello({'clientId': adapter.config.client_id, 'clientSecret': adapter.config.client_secret, 'tokenType': adapter.config.token_type, 'tokenAccess': adapter.config.access_token});
	
	
	/*
	 * Get locations
	 */
	nello.getLocations(function(res)
	{
		// catch error
		if (res.result === false)
		{
			adapter.log.error(res.error);
			return false;
		}
		
		// loop through locations
		res.locations.forEach(function(location)
		{
			adapter.log.info('Updating location: ' + JSON.stringify(location));
			
			// extend address data
			location.address.streetName = location.address.street.trim();
			location.address.streetNumber = location.address.number;
			location.address.street = location.address.streetName + " " + location.address.streetNumber;
			location.address.address = location.address.streetName + " " + location.address.streetNumber + ", " + location.address.zip + " " + location.address.city;
			delete location.address.number;
			
			// create location as device in the ioBroker state tree
			adapter.createDevice(location.location_id, {name: location.address.address}, {}, function()
			{
				// CHANNEL: address
				adapter.createChannel(location.location_id, 'address', {name: 'Address data of the location'}, {}, function()
				{
					for (var key in location.address)
					{
						library.createNode({
								node: location.location_id + '.address.' + key,
								description: key
							},
							{val: location.address[key]}
						);
					}
				});
				
				// CHANNEL: time windows
				adapter.getStatesOf(location.location_id, 'timeWindows', function(err, states)
				{
					for(var d = 0; d < states.length; d++)
						adapter.delObject(states[d]._id);
				});
				
				adapter.createChannel(location.location_id, 'timeWindows', {name: 'Time Windows of the location'}, {}, function()
				{
					nello.getTimeWindows(location.location_id, function(res)
					{
						// catch error
						if (res.result === false)
						{
							adapter.log.error(res.error);
							return false;
						}
						
						adapter.log.info('Updating time windows of location ' + location.address.address + '.');
						// no time windows
						if (res.timeWindows.length === 0)
							library.createNode({node: location.location_id + '.timeWindows.noTimeWindows', description: 'No time windows set'}, {val: ''});
						
						// loop through time windows
						res.timeWindows.forEach(function(window)
						{
							// create channel for the time window
							library.createNode({
									node: location.location_id + '.timeWindows.' + window.id,
									description: window.name
								},
								{val: ''}
							);
							
							// add data
							window.icalRaw = window.ical._raw;
							delete window.ical._raw;
							
							window.icalObj = JSON.stringify(window.ical);
							delete window.ical;
							
							for (var key in window)
							{
								library.createNode({
										node: location.location_id + '.timeWindows.' + window.id + '.' + key,
										description: key
									},
									{val: window[key]}
								);
							}
						});
					});
				});
				
				// CHANNEL: events
				adapter.createChannel(location.location_id, 'events', {name: 'Events of the location'}, {}, function()
				{
					library.createNode({node: location.location_id + '.events.history', description: 'Event history'}, {val: []});
					library.createNode({node: location.location_id + '.events.refreshedTimestamp', description: 'Timestamp of the last event'}, {val: 0});
					library.createNode({node: location.location_id + '.events.refreshedDateTime', description: 'Date-Time of the last event'}, {val: ''});
					
					// listen to events
					nello.listen(location.location_id, adapter.config.uri, function(res)
					{
						adapter.log.debug(JSON.stringify(res));
						
						// successfully attached listener
						if (res.result === true && res.data === undefined)
							adapter.log.info('Listener attached to uri ' + res.uri.url + ':' + res.uri.port + '.');
						
						// received data
						else if (res.result === true && res.data !== undefined)
						{
							/*
							if (res.data !== null)
							{
								adapter.log.debug('Received data from the webhook listener (action -' + res.data.action + '-).');
								
								library.set(location.location_id + '.events.refreshedTimestamp', Math.round(Date.now()/1000));
								library.set(location.location_id + '.events.refreshedTimestamp', library.getDateTime(Date.now()));
								
								adapter.getState(location.location_id + '.events.history', function(err, state)
								{
									var history = JSON.parse(state.val);
									library.set(location.location_id + '.events.history', JSON.stringify(history.concat([res.data])));
									
								});
							}
							*/
						}
						
						// error
						else
						{
							adapter.log.warn('Something went wrong listening to events!');
							adapter.log.debug(JSON.stringify(res));
						}
					});
				});
				
				// create node for the location id
				library.createNode({
						node: location.location_id + '.id',
						description: 'ID of location ' + location.address.streetName
					},
					{val: location.location_id}
				);
				
				// create node for last refresh
				library.createNode({node: location.location_id + '.refreshedTimestamp', description: 'Last update (timestamp) of location ' + location.address.streetName}, {val: Math.round(Date.now()/1000)});
				library.createNode({node: location.location_id + '.refreshedDateTime', description: 'Last update (date-time) of location ' + location.address.streetName}, {val: library.getDateTime(Date.now())});
				
				// create button to open the door
				library.createNode({
						node: location.location_id + '._openDoor',
						description: 'Open door of location ' + location.address.streetName,
						common: {locationId: location.location_id, role: 'button', type: 'boolean'}
					},
					{val: false}
				);
				
				// attach listener
				adapter.subscribeStates(location.location_id + '._openDoor');
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
	
	if (id.indexOf('_openDoor') > -1)
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