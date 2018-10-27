'use strict';
var utils = require(__dirname + '/lib/utils'); // Get common adapter utils
var adapter = utils.adapter('nello');

/*
 * internal libraries
 */
var library = require(__dirname + '/library.js');




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
  
});
