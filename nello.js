var request = require('request');

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
    constructor(connection, adapter)
	{
		// initialise variables
		this.adapter = adapter;
		
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
	 * @param	{string}		locationId		Location the door shall be opened
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
				return true;
			
			else
			{
				if (err !== null)
					this.adapter.log.error(err);
				else
					this.adapter.log.error('Unknown error!');
				
				return false;
			}
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
			{
				if (err !== null)
					that.adapter.log.error(err);
				else
					that.adapter.log.error('Unknown error!');
				
				callback(false);
			}
		});
    }
}
