'use strict';
const utils = require(__dirname + '/lib/utils'); // Get common adapter utils
const adapter = utils.Adapter('nello');

/*
 * internal libraries
 */
const Library = require(__dirname + '/lib/library.js');
const Nello = require('nello');

/*
 * variables initiation
 */
var library = new Library(adapter);
var nello;
var timewindowMap = {};
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
        adapter.log.info('Adapter stopped und unloaded.');
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
	if (!adapter.config.token_type || !adapter.config.access_token)
	{
		adapter.log.error('Token is missing! Please go to settings and generate a token first!');
		return;
	}
	
	// check iot state
	if (!adapter.config.iot) adapter.config.iot = 'iot.0.services.custom_nello';
	
	// check SSL settings, if using DynDNS (respectively not using ioBroker.cloud / iot)
	if (adapter.config.iobroker === '' && adapter.config.uri !== '' && adapter.config.secure && (!adapter.config.certPublicVal || !adapter.config.certPrivateVal))
	{
		adapter.log.error('Usage of Secure Connection (HTTPS) has been selected, but either public certificate or private key (or both) is unselected! Please go to settings and select certificates!');
		return;
	}
	
	
	// initialize nello class
	nello = new Nello({
		'type': adapter.config.token_type,
		'access': adapter.config.access_token,
	}, adapter.config.secure === true ? {
		'cert': adapter.config.certPublicVal || null,
		'key': adapter.config.certPrivateVal || null,
		'ca': adapter.config.certChainedVal || null,
		'selfSigned': adapter.config.selfSigned || true
	} : {});
	
	
	/*
	 * Get locations
	 */
	nello.getLocations(function(res)
	{
		// catch error
		if (res.result === false)
		{
			adapter.log.error(JSON.stringify(res.error));
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
				deleteTimeWindows(location);
				
				adapter.createChannel(location.location_id, 'timeWindows', {name: 'Time Windows of the location'}, {}, function()
				{
					getTimeWindows(location);
				
					if (adapter.config.refresh !== undefined && adapter.config.refresh > 10)
					{
						setInterval(
							function()
							{
								deleteTimeWindows(location);
								getTimeWindows(location);
							},
							Math.round(parseInt(adapter.config.refresh)*1000)
						);
					}
				});
				
				// CHANNEL: events
				if (!adapter.config.uri && !adapter.config.iobroker)
					adapter.log.warn('Can not attach event listener! Please specify ioBroker.cloud / ioBroker.iot URL or external DynDNS URL in adapter settings!');
				
				else
				{
					adapter.createChannel(location.location_id, 'events', {name: 'Events of the location'}, {}, function()
					{
						// attach listener
						nello.attach(location.location_id, adapter.config.iobroker ? adapter.config.iobroker : adapter.config.uri, function(res)
						{
							if (res.result === true)
							{
								adapter.log.info('Listener attached to url ' + res.url + '.');
								
								// attach listener to iobroker.cloud / iobroker.iot
								if (adapter.config.iobroker)
								{
									adapter.subscribeForeignStates(adapter.config.iot);
									adapter.log.debug('Subscribed to state ' + adapter.config.iot + '.');
								}
								
								// attach listener to DynDNS URL
								else if (adapter.config.uri)
								{
									var port = nello._getPort(res.url);
									if (port === null) return;
									
									nello.listen(port, function(res) {setEvent(res.body)});
								}
							}
							else
								adapter.log.warn('Failed to attach listener for webhooks (used url ' + res.url + ').');
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
						common: {locationId: location.location_id, role: 'button.open.door', type: 'boolean', 'write': true}
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
	if (state === null) state = {ack: true, val: null};
	
	// event received
	if (id === adapter.config.iot && state.val)
		setEvent(JSON.parse(state.val));
	
	// door opened
	if (id.indexOf('_openDoor') > -1 && state.ack !== true)
	{
		var location = {};
		location.address = {};
		adapter.getObject(id, function(err, obj)
		{
			location.location_id = obj.common.locationId;
			adapter.getState(location.location_id + '.address.address', function(err, state)
			{
				location.address.address = state.val;
				adapter.log.info('Triggered to open door of location ' + location.address.address + ' (' + location.location_id + ').');
				nello.openDoor(location.location_id);
			});
		});
	}
	
	// add time window (when value is not null for example after clearing)
	if (id.indexOf('timeWindows.createTimeWindow') > -1 && state.ack !== true && state.val !== null)
	{
		var location = {};
		location.address = {};
		adapter.getObject(id, function(err, obj)
		{			
			location.location_id = obj.common.locationId;	
			try
			{
				location.timewindowData = JSON.parse(state.val);
				adapter.getState(location.location_id + '.address.address', function(err, state)
				{
					location.address.address = state.val;
					
					// Validation if name is present
					if (location.timewindowData.name === false || typeof location.timewindowData.name !== 'string')
						adapter.log.error('No name for the time window has been provided!');
					
					// Simple validation of ical (used from https://github.com/Zefau/nello.io)
					if (location.timewindowData.ical === false || typeof location.timewindowData.ical !== 'string' || (location.timewindowData.ical.indexOf('BEGIN:VCALENDAR') === -1 || location.timewindowData.ical.indexOf('END:VCALENDAR') === -1 || location.timewindowData.ical.indexOf('BEGIN:VEVENT') === -1 || location.timewindowData.ical.indexOf('END:VEVENT') === -1))
						adapter.log.error('Wrong ical data for timewindow provided! Missing BEGIN:VCALENDAR, END:VCALENDAR, BEGIN:VEVENT or END:VEVENT.');
					
					adapter.log.info('Triggered to create timewindow of location ' + location.address.address + ' (' + location.location_id + ').');	
					nello.createTimeWindow(obj.common.locationId, location.timewindowData, function(res)
					{ 
						if (res.result === false)
							adapter.log.error('Creation for time window failed: ' + res.error);
						
						else
						{
							adapter.log.info('Time window with id ' + res.timeWindow.id +' was created.');
							// refresh timewindows for new timewindow							
							getTimeWindows(location);							
						}						
					});
				});
			}
			catch(err)
			{
				adapter.log.error('Parsing error for time window data: ' + err.message);
				return; // cancel
			}
			finally
			{
				// clearing createTimewindow state
				adapter.setState(id, null);
			}
		});
	}
	
	// delete time window
	if (id.indexOf('deleteTimeWindow') > -1 && state.ack !== true)
	{
		var location = {};
		location.address = {};
		adapter.getObject(id, function(err, obj)
		{			
			location.location_id = obj.common.locationId;	
			location.timewindowId = obj.common.timewindowId;
			adapter.getState(location.location_id + '.address.address', function(err, state)
			{
				location.address.address = state.val;
				adapter.log.info('Triggered to delete time window (' + location.timewindowId + ') of location ' + location.address.address + ' (' + location.location_id + ').');
				nello.deleteTimeWindow(obj.common.locationId, obj.common.timewindowId, function(res)
				{
					if (res.result === false)
						adapter.log.error('Deleting time window failed: ' + res.error);
					
					else
					{
						adapter.log.info('Time window with id ' + location.timewindowId +' was deleted.');
						// delete old timewindow object
						adapter.delObject(location.location_id + '.timeWindows.' + location.timewindowId);		
						// refresh timewindows for indexedTimeWindows
						getTimeWindows(location);			
					}						
				});
			});
		});
	}
	
	// delete all time windows
	if (id.indexOf('deleteAllTimeWindows') > -1 && state.ack !== true)
	{
		var location = {};
		location.address = {};
		adapter.getObject(id, function(err, obj)
		{			
			location.location_id = obj.common.locationId;	
			adapter.getState(location.location_id + '.address.address', function(err, state)
			{
				location.address.address = state.val;
				adapter.log.info('Triggered to delete all time windows of location ' + location.address.address + ' (' + location.location_id + ').');
				var timeWindowCount = Object.keys(timewindowMap).length;
				// Using timewindowMap-Kekys here and not api function `deleteAllTimeWindows` to know which callback is the last to update the objects		
				Object.keys(timewindowMap).forEach(function(timewindowId) 
				{
					nello.deleteTimeWindow(obj.common.locationId, timewindowId, function(res)
					{
						timeWindowCount--;
						if (res.result === false)
							adapter.log.error('Deleting time window failed: ' + res.error);							
						else
						{
							adapter.log.info('Time window with id ' + timewindowId +' was deleted.');
							// Last timewindow was deleted -> update objects
							if(timeWindowCount === 0)
							{
								adapter.log.info('All time windows have been deleted.');
								// delete all old timewindows
								deleteTimeWindows(location);	
								// refresh timewindows for indexedTimeWindows
								getTimeWindows(location);
							}
						}						
					});
				});
			});
		});
	}
});

/*
 * HANDLE MESSAGES
 *
 */
adapter.on('message', function(msg)
{
	adapter.log.debug('Message: ' + JSON.stringify(msg));
	
	switch(msg.command)
	{
		case 'setToken':
			nello = new Nello();
			nello.setToken(msg.message.clientId, msg.message.clientSecret, function(res)
			{
				adapter.log.debug(JSON.stringify(res));
				
				if (res.result === true)
				{
					adapter.log.debug('Generated token using Client ID and Client Secret: ' + JSON.stringify(res.token));
					library.msg(msg.from, msg.command, res.token, msg.callback);
				}
				else
				{
					adapter.log.warn('Failed generating token (' + JSON.stringify(res) + ')!');
					library.msg(msg.from, msg.command, res, msg.callback);
				}
			});
			break;
	}
});

/**
 * Get time windows.
 *
 */
function getTimeWindows(location)
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
		
		res.timeWindows.forEach(function(window)
		{
			// create states
			library.set({node: location.location_id + '.timeWindows.' + window.id, description: 'Time Window: ' + window.name}, '');
			
			// add to timewindowMap
			timewindowMap[window.id] = window;
			
			// add data
			window.icalRaw = window.ical._raw;
			delete window.ical._raw;
			
			window.icalObj = JSON.stringify(window.ical);
			delete window.ical;
			
			for (var key in window)
				library.set(Object.assign({node: location.location_id + '.timeWindows.' + window.id + '.' + key}, nodes['timeWindows.' + key] || {}), window[key]);
			
			// create button to delete the timewindow
			library.set({
					node: location.location_id + '.timeWindows.' + window.id + '.deleteTimeWindow',
					description: 'Delete the time window ' + window.id + ' of location ' + location.address.address,
					common: {locationId: location.location_id, timewindowId: window.id, role: 'button.delete', type: 'boolean', 'write': true}
				},
				false
			);
			
			// attach listener
			adapter.subscribeStates(location.location_id + '.timeWindows.' + window.id + '.deleteTimeWindow');
		});
		
		// create index with time window IDs
		library.set({node: location.location_id + '.timeWindows.indexedTimeWindows', description: 'Index of all time windows', role: 'text'}, Object.keys(timewindowMap).join(','));
		
		// create object for creating a timewindow
		library.set({
				node: location.location_id + '.timeWindows.createTimeWindow',
				description: 'Creating a time window for location ' + location.address.streetName,
				common: {locationId: location.location_id, role: 'json', type: 'string', 'write': true}
			}
		);
		
		// attach listener
		adapter.subscribeStates( location.location_id + '.timeWindows.createTimeWindow');
		
			
		// create button to delete all timewindows
		library.set({
				node: location.location_id + '.timeWindows.deleteAllTimeWindows',
				description: 'Delete all time windows of location ' + location.address.address,
				common: {locationId: location.location_id, role: 'button.delete', type: 'boolean', 'write': true}
			},
			false
		);
		
		// attach listener
		adapter.subscribeStates( location.location_id + '.timeWindows.deleteAllTimeWindows');
	});
}

/**
 * Delete states of old time windows.
 *
 */
function deleteTimeWindows(location)
{
	adapter.getStatesOf(location.location_id, 'timeWindows', function(err, states)
	{
		for(var d = 0; d < states.length; d++)
			adapter.delObject(states[d]._id);
	});
	// clearing the time window map
	timewindowMap = {};
}

/**
 *
 *
 */
function setEvent(res)
{
	if (res === undefined || res.action === undefined || res.action === null || res.data === undefined || res.data === null) return false;
	adapter.log.debug('LISTENER: ' + JSON.stringify(res) + '...');
	adapter.log.info('Received data from the webhook listener (action -' + res.action + '-).');	

	res.data.timestamp = res.data.timestamp != null ? res.data.timestamp : Math.round(Date.now()/1000);
	library.set({node: res.data.location_id + '.events.refreshedTimestamp', description: 'Timestamp of the last event', role: 'value'}, res.data.timestamp);
	library.set({node: res.data.location_id + '.events.refreshedDateTime', description: 'DateTime of the last event', role: 'text'}, library.getDateTime(res.data.timestamp*1000));

	adapter.getState(res.data.location_id + '.events.feed', function(err, state)
	{
		var feed = state !== undefined && state !== null && state.val !== '' ? JSON.parse(state.val) : [];
		library.set({node: res.data.location_id + '.events.feed', description: 'Activity feed / Event history', role: 'json'}, JSON.stringify(feed.concat([res])));
	});
}
