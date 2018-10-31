const _request = require('request');
const _http = require('http');
const _ical = require('ical.js');
const _uuidv4 = require('uuid/v4');

/**
 * 
 *
 *
 */
module.exports = class Nello
{
	/**
	 *
	 *
	 */
    constructor(connection)
	{
		// initialise variables
		this.clientId = connection.clientId;
		this.clientSecret = connection.clientSecret;
		this.token = {
			type: connection.tokenType,
			access: connection.tokenAccess,
		};
    }
	
	/**
	 * Converts an ical string to an object with all the data. See https://www.npmjs.com/package/jsical for more information.
	 *
	 * @see		{@link https://www.npmjs.com/package/jsical|jsical -Javascript parser for rfc5545-} for more information on the returned value
	 * @param	{string}		ical			Ical string to be converted
	 * @return	{object}		ical			Parsed ical as object (incl. _raw index for original string)
	 * @return	{string}		ical.uid		UID of the event
	 * @return	{string}		ical.summary	Summary of the event
	 * @return	{object}		ical.dtstamp	Stamp of the event with indizes year, month, day, hour, minute, second, isDate, timezone
	 * @return	{object}		ical.dtstart	Start of the event with indizes year, month, day, hour, minute, second, isDate, timezone
	 * @return	{object}		ical.dtend		End of the event with indizes year, month, day, hour, minute, second, isDate, timezone
	 * @return	{object}		ical.recurrence	Recurrence of event with indizes depending on specific recurrency freq, byday, bymonthday, bymonth, until
	 *
	 */
	_getIcal(ical)
	{
		var data = {_raw: JSON.stringify(ical)};
		var vevent = new _ical.Component(_ical.parse(ical)).getFirstSubcomponent('vevent');
		['UID', 'SUMMARY', 'DTSTAMP', 'DTSTART', 'DTEND'].forEach(function(key)
		{
			data[key.toLowerCase()] = vevent.getFirstPropertyValue(key.toLowerCase()) || null;
		});
		
		data.rrule = new _ical.Recur(vevent.getFirstPropertyValue('rrule'));
		return data;
	}
	
	/**
	 * Converts an ical object to a string with the relevant data. See https://www.npmjs.com/package/jsical for more information.
	 *
	 * @see		{@link https://www.npmjs.com/package/jsical|jsical -Javascript parser for rfc5545-} for more information on the returned value
	 * @param	{object|array}		ical			Ical object to be converted to string
	 * @param	{string}		ical.id			UID of the event
	 * @param	{string}		ical.name		Name of the event
	 * @param	{string}		ical.summary	Summary of the event
	 * @param	{string}		ical.start		Start date of the event
	 * @param	{string}		ical.end		End date or duration of the event
	 * @return	{string}						Parsed ical as srting
	 *
	 */
	_setIcal(data)
	{
		/*
		var event = new icalendar.VEvent(data.id || _uuidv4());
		event.setSummary(data.summary || data.name);
		event.setDate(data.start, data.end);
		event.setDate(data.rrule);
		
		until
		bymonzh
		by day
		by monthday
		freq
		
		return event.toString().replace(/ /gi, '\r\n');
		*/
		
		return '';
	}
	
	/**
	 * Sends a request to the nello API.
	 *
	 * @param	{string}		url				URL to be called
	 * @param	{string}		method			(optional) Method to be used (GET, POST, PUT or DELETE), default is GET
	 * @param	{object}		body			(optional) Body to be sent with the request, default is empty {}
	 * @param	{object}		callback		(optional)
	 * @param	{function}		callback.fct	(optional) Callback function to be invoked receiving -err, res, body- as param
	 * @param	{function}		callback.return	(optional) Callback function to be invoked only receiving -{result: true|false, error: {..}}- as param
	 * @return	{object}						this
	 *
	 */
	_req(url, method = "GET", callback = {}, body = {})
	{
		_request({
			uri: url,
			method: method,
			headers: {
				"Authorization": this.token.type + " " + this.token.access
			},
			body: body,
			json: true
		},
		callback.fct !== undefined ? callback.fct : function(err, res, body)
		{
			if (body !== undefined && body.result !== undefined && body.result.success === true)
				callback.return({result: true});
			
			else
				callback.return({result: false, error: err});
		});
		
		return this;
	}
	
	/**
	 * Opens door of a location.
	 *
	 * @param	{string}		locationId		ID of the location
	 * @param	{function}		callback		(optional) Callback function to be invoked
	 * @return	{object}						this
	 *
	 */
	openDoor(locationId, callback = function() {})
	{
		return this._req("https://public-api.nello.io/v1/locations/" + locationId + "/open/", "PUT", {return: callback});
	}
	
	/**
	 * Gets all locations.
	 *
	 * @param	{function}		callback		Callback function to be invoked
	 * @return	{object}						this
	 *
	 */
	getLocations(callback)
	{
		return this._req("https://public-api.nello.io/v1/locations/", "GET", {fct: function(err, res, body)
			{
				if (body !== undefined && body.result !== undefined && body.result.success === true)
					callback({result: true, locations: body.data});
				
				else
					callback({result: false, error: err});
			}
		});
    }
	
	/**
	 * Gets all time windows.
	 *
	 * @param	{string}		locationId		ID of the location
	 * @param	{function}		callback		Callback function to be invoked
	 * @return	{object}						this
	 *
	 */
	getTimeWindows(locationId, callback)
	{
		var that = this;
		return this._req("https://public-api.nello.io/v1/locations/" + locationId + "/tw/", "GET", {fct: function(err, res, body)
			{
				if (body !== undefined && body.result !== undefined && body.result.success === true)
				{
					// convert ical-string to full data object
					body.data.forEach(function(entry, i)
					{
						body.data[i].ical = that._getIcal(entry.ical);
					});
					
					callback({result: true, timeWindows: body.data});
				}
				
				else
					callback({result: false, error: err});
			}
		});
	}
	
	/**
	 * Creates a time window.
	 *
	 * @param	{string}		locationId			ID of the location
	 * @param	{object}		data				Data for the time window
	 * @param	{string}		data.name			Name of the time window
	 * @param	{string|object}	data.ical			Ical data of the time window
	 * @param	{string|object}	data.ical.summary	(optional) Description of the time window, default is data.name
	 * @param	{function}		callback			(optional) Callback function to be invoked
	 * @return	{object}							this
	 *
	 */
	createTimeWindow(locationId, data, callback = function() {})
	{
		// convert ical to object
		// 
		// BEGIN:VCALENDAR\r\n
		// BEGIN:VEVENT\r\n
		// 	DTEND:20171208T165800Z\r\n
		//	DTSTART:20171208T165600Z\r\n
		//	SUMMARY:a description text\r\n
		//	\r\n
		// END:VEVENT\r\n
		// END:VCALENDAR\r\n
		//
		if (data.ical !== 'string')
			data.ical = this._setIcal(Object.assign(data.ical, {name: data.name}));
		
		// roughly verify ical data
		else if (data.ical === 'string' && (data.ical.indexOf('BEGIN:VCALENDAR') === -1 || data.ical.indexOf('END:VCALENDAR') === -1 || data.ical.indexOf('BEGIN:VEVENT') === -1 || data.ical.indexOf('END:VEVENT') === -1))
			callback({result: false, error: 'Wrong ical data provided! Missing BEGIN:VCALENDAR, END:VCALENDAR, BEGIN:VEVENT or END:VEVENT.'});
		
		// request
		return this._req("https://public-api.nello.io/v1/locations/" + locationId + "/tw/", "POST", {fct: function(err, res, body)
			{
				if (body !== undefined && body.result !== undefined && body.result.success === true)
					callback({result: true, timeWindow: data.body});
				
				else
					callback({result: false, error: err});
			}
		}, {'name': data.name, 'ical': data.ical});
	}
	
	/**
	 * Deletes a time window.
	 *
	 * @param	{string}		locationId		ID of the location
	 * @param	{string}		twId			ID of the time window
	 * @param	{function}		callback		(optional) Callback function to be invoked
	 * @return	{object}						this
	 *
	 */
	deleteTimeWindow(locationId, twId, callback = function() {})
	{
		return this._req("https://public-api.nello.io/v1/locations/" + locationId + "/tw/" + twId + "/", "DELETE", {return: callback});
	}
	
	/**
	 * Unubscribe from events (delete a webhook)
	 *
	 * @param	{string}			locationId		ID of the location
	 * @param	{function}			callback		(optional) Callback function to be invoked
	 * @return	{object}							this
	 *
	 */
	unlisten(locationId, callback = function() {})
	{
		return this._req("https://public-api.nello.io/v1/locations/" + locationId + "/webhook/", "DELETE", {return: callback});
	}
	
	/**
	 * Subscribe / listen to events (add a webhook)
	 *
	 * @param	{string}			locationId		ID of the location
	 * @param	{object|string}		uri				External URL including port (e.g. www.domain.com:port) of the webhook that the adapter is listening on
	 * @param	{string}			uri.url			External URL of the webhook that the adapter is listening on
	 * @param	{integer}			uri.port		External Port of the webhook that the adapter is listening on
	 * @param	{array}				actions			(optional) Actions to listen to (defaults to ['swipe', 'geo', 'tw', 'deny'])
	 * @param	{function}			callback		Callback function to be invoked
	 * @return	{object}							this
	 *
	 */
	listen(locationId, uri, callback) {listen(locationId, uri, null, callback)}
	listen(locationId, uri, actions, callback)
	{
		// convert uri to object
		if (typeof uri === 'string')
		{
			if (uri.indexOf(':') === -1)
				callback({result: false, error: 'Invalid url specified! Please specify port using ":", e.g. domain.com:PORT!'});
			
			else
				var u = {
					url: uri.substr(0, uri.indexOf(':')),
					port: uri.substr(uri.indexOf(':')+1)
				};
		}
		else
			var u = uri;
		
		// request
		return this._req("https://public-api.nello.io/v1/locations/" + locationId + "/webhook/", "PUT", {fct: function(err, res, body)
			{
				if (body !== undefined && body.result !== undefined && body.result.success === true)
				{
					_http.createServer(function(request, response)
					{
						var data = {};
						request
							.on('data', (chunk) => {data = chunk})
							.on('end', () => {callback({result: true, data: data})});
					}).listen(u.port);
				}
				
				else
					callback({result: false, error: err});
			}
		}, {'url': u.url, 'actions': Array.isArray(actions) && actions.length > 0 ? actions : ['swipe', 'geo', 'tw', 'deny']});
	}
}
