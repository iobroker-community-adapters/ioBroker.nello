/**
 * Decodes a string with given key.
 *
 * @param {string} key
 * @param {string} string
 * @return {string}
 *
 */
function decode(key, string)
{
    var result = '';
    for (var i=0; i < string.length; ++i) {
		result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ string.charCodeAt(i));
    }
	
    return result;
}

/**
 * Encode a string with given key.
 *
 * @param {string} key
 * @param {string} string
 * @return {string}
 *
 */
function encode(key, string)
{
	var result = '';
	for(var i = 0; i < string.length; i++) {
		result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ string.charCodeAt(i));
	}
	
	return result;
}

/**
 * Creates a node
 *
 *
 */
function createNode(adapter, node, state)
{
	adapter.setObject(
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
		set(adapter, node.node, state.val)
	);
}

/**
 * Sets a value of a node (and creates it in case of non-existence)
 *
 *
 *
 *
 */
function set(adapter, node, value)
{
	if (value !== undefined)
		adapter.setState(node, {val: value, ts: Date.now(), ack: true}, function(err) {if (err) adapter.log.error(err);})
}

/*
 * EXPORT modules
 */
module.exports.decode = decode;
module.exports.encode = encode;
module.exports.createNode = createNode;
module.exports.set = set;
