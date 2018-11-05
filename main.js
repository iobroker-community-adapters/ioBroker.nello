'use strict';
const utils = require(__dirname + '/lib/utils'); // Get common adapter utils
const adapter = utils.Adapter('nello');

/*
 * internal libraries
 */
const Library = require(__dirname + '/library.js');
const Nello = require('nello');

/*
 * variables initiation
 */
var library;
var nello;
var nodes = {
	
	// address
	'address.address': {role: 'text', description: 'Full address of the location'},
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
	nello = new Nello({
		'clientId': adapter.config.client_id,
		'clientSecret': adapter.config.client_secret,
		'tokenType': adapter.config.token_type,
		'tokenAccess': adapter.config.access_token,
		
		// PLEASE NOTE: The nello API v1 does not seem to support SSL / HTTPS
		//
		/*'ssl': {
			'key': adapter.config.certPrivate,
			'cert': adapter.config.certPublic
		}*/
	});
	
	
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
						library.set(Object.assign({node: location.location_id + '.address.' + key}, nodes['address.' + key] || {}), location.address[key]);
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
						
						// loop through time windows
						adapter.log.info('Updating time windows of location ' + location.address.address + '.');
						
						var index = "";
						res.timeWindows.forEach(function(window)
						{
							// create states
							library.set({node: location.location_id + '.timeWindows.' + window.id, description: 'Time Window: ' + window.name}, '');
							
							// add to index
							index = index + window.id + ',';
							
							// add data
							window.icalRaw = window.ical._raw;
							delete window.ical._raw;
							
							window.icalObj = JSON.stringify(window.ical);
							delete window.ical;
							
							for (var key in window)
							{
								library.set(Object.assign({node: location.location_id + '.timeWindows.' + window.id + '.' + key}, nodes['timeWindows.' + key] || {}), window[key]);
							}
						});
						
						// create index with time window IDs
						library.set({node: location.location_id + '.timeWindows.indexedTimeWindows', description: 'Index of all time windows', role: 'text'}, index);
					});
				});
				
				// CHANNEL: events
				if (!adapter.config.uri || adapter.config.uri.indexOf(':') === -1)
					adapter.log.warn('Can not attach event listener! Please specify external URL including Port in adapter settings!');
				
				else
				{
					adapter.createChannel(location.location_id, 'events', {name: 'Events of the location'}, {}, function()
					{
						// listen to events
						nello.listen(location.location_id, adapter.config.uri, function(res)
						{
							adapter.log.debug('LISTENER: ' + JSON.stringify(res) + '...');
							
							// successfully attached listener
							if (res.result === true && res.body === undefined)
								adapter.log.info('Listener attached to uri ' + res.uri.url + ':' + res.uri.port + '.');
							
							// received data
							else if (res.result === true && res.body !== undefined)
							{
								if (res.body !== null)
								{
									adapter.log.info('Received data from the webhook listener (action -' + res.body.action + '-).');
									
									library.set({node: location.location_id + '.events.refreshedTimestamp', description: 'Timestamp of the last event', role: 'value'}, Math.round(res.body.data.timestamp));
									library.set({node: location.location_id + '.events.refreshedDateTime', description: 'DateTime of the last event', role: 'text'}, library.getDateTime(res.body.data.timestamp*1000));
									
									adapter.getState(location.location_id + '.events.feed', function(err, state)
									{
										var feed = state !== undefined && state !== null && state.val !== '' ? JSON.parse(state.val) : [];
										library.set({node: location.location_id + '.events.feed', description: 'Activity feed / Event history', role: 'json'}, JSON.stringify(feed.concat([res.body])));
									});
								}
							}
							
							// error
							else
							{
								adapter.log.warn('Something went wrong listening to events!');
								adapter.log.debug(JSON.stringify(res));
							}
						});
					});
				}
				
				// create node for the location id
				library.set({node: location.location_id + '.id', description: 'ID of location ' + location.address.streetName, role: 'id'}, location.location_id);
				
				// create node for last refresh
				library.set({node: location.location_id + '.refreshedTimestamp', description: 'Last update (Timestamp) of location ' + location.address.streetName, role: 'value'}, Math.round(Date.now()/1000));
				library.set({node: location.location_id + '.refreshedDateTime', description: 'Last update (DateTime) of location ' + location.address.streetName, role: 'text'}, library.getDateTime(Date.now()));
				
				// create button to open the door
				library.set({
						node: location.location_id + '._openDoor',
						description: 'Open door of location ' + location.address.streetName,
						common: {locationId: location.location_id, role: 'button.open.door', type: 'boolean'}
					},
					false
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
	
	if (id.indexOf('_openDoor') > -1 && state.ack !== true)
	{
		var location = {};
		adapter.getObject(id, function(err, obj)
		{
			location.location_id = obj.common.locationId;
			adapter.getState(location.location_id + '.address.address', function(err, state)
			{
				location.address = state.val;
				adapter.log.info('Triggered to open door of location ' + location.address + ' (' + location.location_id + ').');
				nello.openDoor(location.location_id);
			});
		});
	}
});
