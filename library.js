/**
 * Library
 *
 *
 */
module.exports = class Library
{
    constructor(adapter)
	{
		this.adapter = adapter;
    }
	
	/**
	 * Decodes a string with given key.
	 *
	 * @param	{string}	key			Key to be used to decode string
	 * @param	{string}	string		String to be decoded
	 * @return	{string}				Decoded string
	 *
	 */
	decode(key, string)
	{
		var result = '';
		for (var i = 0; i < string.length; ++i)
			result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ string.charCodeAt(i));
		
		return result;
	}

	/**
	 * Encode a string with given key.
	 *
	 * @param	{string}	key			Key to be used to encode string
	 * @param	{string}	string		String to be encoded
	 * @return	{string}				Encoded string
	 *
	 */
	encode(key, string)
	{
		var result = '';
		for (var i = 0; i < string.length; i++)
			result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ string.charCodeAt(i));
		
		return result;
	}

	/**
	 * Convert a timestamp to datetime.
	 *
	 * @param	{integer}	timestamp		Timestamp to be converted to date-time format
	 * @return	{string}					Timestamp in date-time format
	 *
	 */
	getDateTime(timestamp)
	{
		if (timestamp === undefined)
			return '';
		
		var date    = new Date(timestamp);
		var day     = '0' + date.getDate();
		var month   = '0' + (date.getMonth() + 1);
		var year    = date.getFullYear();
		var hours   = '0' + date.getHours();
		var minutes = '0' + date.getMinutes();
		var seconds = '0' + date.getSeconds();
		return day.substr(-2) + '.' + month.substr(-2) + '.' + year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	}

	/**
	 * Creates an object (channel or state) and sets its values.
	 *
	 * @param	{object}	node					
	 * @param	{string}	node.node				
	 * @param	{string}	node.description		
	 * @param	{object}	node.common				
	 * @param	{string}	node.common.role		
	 * @param	{string}	node.common.type		
	 * @param	{object}	node.native				
	 * @param	{object}	state					
	 * @param	{string}	state.name				
	 * @param	{string}	state.val				
	 * @return	void
	 *
	 */
	createNode(node, state)
	{
		this.adapter.setObject(
			node.node,
			{
				common: Object.assign(node.common || {}, {
					name: node.description.replace(/%name%/gi, state.name) || '',
					role: node.common !== undefined && node.common.role ? node.common.role : 'state',
					type: node.common !== undefined && node.common.type ? node.common.type : 'string'
				}),
				type: 'state',
				native: node.native || {}
			},
			this.set(node.node, state.val)
		);
	}

	/**
	 * Sets a value of a state.
	 *
	 * @param	{string}	node		State the value shall be set
	 * @param	{string}	value		Value to be set
	 * @return	void
	 *
	 */
	set(node, value)
	{
		if (value !== undefined)
			this.adapter.setState(node, {val: value, ts: Date.now(), ack: true}, function(err) {if (err) this.adapter.log.error(err);})
	}
}