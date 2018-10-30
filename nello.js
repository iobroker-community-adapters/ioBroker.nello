var request = require('request');
var ical = require('ical');

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
	 * Opens door of a location.
	 *
	 * @param	{string}		locationId		ID of the location
	 * @param	{function}		callback		(optional) Function to be invoked
	 * @return	{boolean}						Status whether door has been opened or not
	 *
	 */
	openDoor(locationId, callback = function() {})
	{
		request({
			uri: "https://public-api.nello.io/v1/locations/" + locationId + "/open/",
			method: "PUT",
			headers: {
				"Authorization": this.token.type + " " + this.token.access
			},
			json: true
		},
		function(err, res, body)
		{
			if (body !== undefined && body.result !== undefined && body.result.success === true)
				callback(true);
			
			else
				callback(false);
		});
	}
	
	/**
	 * Gets all locations.
	 *
	 * @param	{function}		callback	Function to be invoked
	 * @return	void
	 *
	 */
	getLocations(callback)
	{
		var that = this;
		request({
			uri: "https://public-api.nello.io/v1/locations/",
			method: "GET",
			headers: {
				"Authorization": this.token.type + " " + this.token.access
			},
			json: true
		},
		function(err, res, body)
		{
			if (body !== undefined && body.result !== undefined && body.result.success === true)
				callback(body.data);
			
			else
				callback(false);
		});
    }
	
	/**
	 * Gets all time windows.
	 *
	 * @param	{string}		locationId		ID of the location
	 * @param	{function}		callback		Function to be invoked
	 * @return	void
	 *
	 */
	getTimeWindows(locationId, callback)
	{
		var that = this;
		request({
			uri: "https://public-api.nello.io/v1/locations/" + locationId + "/tw/",
			method: "GET",
			headers: {
				"Authorization": this.token.type + " " + this.token.access
			},
			json: true
		},
		function(err, res, body)
		{
			if (body !== undefined && body.result !== undefined && body.result.success === true)
			{
				// convert ical-string to full data object
				body.data.forEach(function(entry, i)
				{
					body.data[i].ical = Object.assign({_raw: entry.ical}, Object.values(ical.parseICS(entry.ical))[0]);
				});
				
				callback(body.data);
			}
			
			else
				callback(false);
		});
	}
	
	/**
	 * Deletes a time window.
	 *
	 * @param	{string}		locationId		ID of the location
	 * @param	{string}		twId			ID of the time window
	 * @return	void
	 *
	 */
	deleteTimeWindow(locationId, twId, callback = function() {})
	{
		var that = this;
		request({
			uri: "https://public-api.nello.io/v1/locations/" + locationId + "/tw/" + twId + "/",
			method: "DELETE",
			headers: {
				"Authorization": this.token.type + " " + this.token.access
			},
			json: true
		},
		function(err, res, body)
		{
			if (body !== undefined && body.result !== undefined && body.result.success === true)
				callback(true);
			
			else
				callback(false);
		});
	}
}
