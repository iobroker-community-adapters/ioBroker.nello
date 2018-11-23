![Logo](admin/nello.png)
# ioBroker.nello
nello one connects your intercom with your smartphone and Wi-Fi. This adapter connects your nello one to ioBroker using the official API (https://nellopublicapi.docs.apiary.io/).

Developers may find the javascript implementation of the nello.io API via https://github.com/Zefau/nello.io.

[![NPM version](http://img.shields.io/npm/v/iobroker.nello.svg)](https://www.npmjs.com/package/iobroker.nello)
[![Travis CI](https://travis-ci.org/Zefau/ioBroker.nello.svg?branch=master)](https://travis-ci.org/Zefau/ioBroker.nello)
[![Downloads](https://img.shields.io/npm/dm/iobroker.nello.svg)](https://www.npmjs.com/package/iobroker.nello)

[![NPM](https://nodei.co/npm/iobroker.nello.png?downloads=true)](https://nodei.co/npm/iobroker.nello/)


## Setup instructions (English)
### Quick Setup
The nello auth API is responsible for authentication of all nello client apps. This service follows OAuth2 as an authentication scheme to authenticate an app/user. For further information about the OAuth2 standard, please check here: https://oauth.net/2/.
To use this service, client credentials must be obtained from the nello auth admin UI located at: https://auth.nello.io/admin. Please not that for the time being you can only get one pair of client_id and client_secret. They consist of a client_id and a client_secret.

1. Generate Client ID and Client Secret on https://auth.nello.io/admin
2. In the ioBroker.nello adapter settings, fill in both Client ID / Client Secret
3. Press the button "Get Token" to generate a token
4. Save and enjoy the adapter

This quick setup will retrieve your locations (all available doors) from the nello API including the respective address. Furthermore, the assigned time windows of the locations will be retrieved. Additionally, you may open the door with this basic setup.
To receive events (door bell rings), you have to follow the advanced setup.

### Advanced Setup
To received events (door bell rings) you have to provide an external URL (with port) in the ioBroker.nello adapter settings.
This URL (incl. port) is sent to the nello API and registered. In case a door bell ring is registered by the API, the API will push this information to the provided URL. Please refer to https://en.wikipedia.org/wiki/Webhook for more information.
If you no DynDNS address and no idea what the shit I'm talking about, please refer to https://www.howtogeek.com/66438/how-to-easily-access-your-home-network-from-anywhere-with-ddns/.

1. Place the external DynDNS address including a port of your choice in the ioBroker.nello adapter settings
2. Open the port of your choice in your router and route it to the ioBroker
3. Done. You will now have additional states in your nello tree within the channel "events" and all events are written to a state named "feed".


## Installation (German)
1. Generiere eine Client ID und ein Client Secret über die Website https://auth.nello.io/admin
2. In den ioBroker.nello adapter Einstellungen die Client ID und das Client Secret eintragen
3. Den Button "Get Token" nutzen, um einen Token zu generieren
4. Speichern und den Adapter genießen


## Smart Home / Alexa integration using ioBroker.javascript
Some examples of a possible integration within your smart home.

### Open door using Alexa
This requires the ioBroker adapter ioBroker.cloud (https://github.com/ioBroker/ioBroker.cloud).

Save the following function within a script in the "global" folder in the "Scripts" tab of ioBroker:

```
/**
 * Register node in Cloud Adapter
 * 
 * @param   {string}    node        Node to be published
 * @param   {string}    label       Name / label of the node within Cloud Adapter
 * @param   {object}    settings    (optional) Extra settings
 * @param   {string}    type        (optional) Type of node, e.g. LIGHT, SWITCH, THERMOSTAT, ACTIVITY_TRIGGER, SCENE_TRIGGER, SMARTPLUG, SMARTLOCK, CAMERA
 * @param   {string}    byOn        (optional) Default when turning on
 * @return  void
 */
function cloud(node, label, settings = {})
{
    log('Published '+node+' as '+label+' in Cloud Adapter.');
    
    settings = typeof settings === 'string' ? {type: settings} : settings;
    extendObject(node, {common: {smartName: {en: label, smartType: settings.type || 'SWITCH', byON: settings.byON || ''}}});
}
```
_(updated on 2018-11-22 and fixed incorrect empty settings)_

You can use this function for every state within ioBroker Object tree to register the state in the ioBroker.cloud adapter and use it within Alexa.
**IMPORTANT**: Go into adapter settings of ioBroker.javascript and check the box "Enable command setObject"!

Now create a new script in the "common" folder using the function:
```
cloud('nello.0.#YOUR DOOR ID#._openDoor', 'Tür öffnen');
```
Replace **#YOUR DOOR ID#** (also replace #) with the ID of the door you want to open. You find the ID in the ioBroker.nello state tree ("Objects" tab of ioBroker).

Eventually, search / discover new devices in your Alexa app and create a routine in the Alexa app (e.g. "Alexa, open door") and assign the newly discovered state to it. Finished! Now you may tell Alexa to open your door for you.

### Let Alexa inform you about door ring
This requires the ioBroker adapter ioBroker.alexa2 (https://github.com/Apollon77/ioBroker.alexa2).

In order to use the voice output of Alexa we define a function ```say```. Place the following function in a script in the "global" folder of ioBroker.javascript (you may place it in the same one as above). **IMPORTANT**: Replace #YOUR ALEXA ID# (also replace #) with your Alexa ID. You may find the Alexa ID in the Objects tree of ioBroker ```alexa2.0.Echo-Devices```.

```
/**
 * Say something with Alexa.
 * 
 * @param       {string}        message         Message to say
 * @param       {string|array}  alexas          Alexa Device to say the voice message
 * @return      void
 * 
 */
function say(message, alexas = '#YOUR ALEXA ID#') // use alexas = ['#YOUR ALEXA ID 1#', '#YOUR ALEXA ID 2#'] for default voice output from multiple devices (also replace #)
{
    alexas = typeof alexas === 'string' ? [alexas] : alexas;
    alexas.forEach(function(alexa)
    {
        setState('alexa2.0.Echo-Devices.' + alexa + '.Commands.speak', message);
    });
}
```
_(updated on 2018-11-18 to support voice output from multiple alexa devices at a time)_

You can use this function within ioBroker.javascript to say a phrase using Alexa  ```say('Hello World')``` or ```say('Hello World', ['#YOUR ALEXA ID 1#', '#YOUR ALEXA ID 2#'])``` for voice output from multiple devices.

Create a script in the "common" folder of ioBroker.javascript (or use the one you created above) and add the following listener to it:
```
var L = {
    'actionRingUnknown': 'Es hat an der Tür geklingelt!',
    'actionOpenName': '%name% hat die Tür geöffnet.',
    'actionOpen': 'Die Haustür wurde geöffnet.'
};

on({id: 'nello.0.#YOUR DOOR ID#.events.feed', change: 'any'}, function(obj)
{
    var events = JSON.parse(obj.state.val);
    if (events.length === 0) return;
    
    var event = events[events.length-1];
    if (event.action == 'deny')
        say(L.actionRingUnknown);
    
    else if (event.action == 'swipe' || event.action == 'geo')
        say(L.actionOpenName.replace(/%name%/gi, event.data.name));
        
    else
        say(L.actionOpen);
});
```
Based on the action of the event, Alexa will inform you about the door being opened or the door bell being recognized.
**IMPORTANT**: Replace #YOUR DOOR ID# (also replace #) with your nello door ID.


## Changelog

### 0.4.5 / 0.4.6 (2018-11-23)
- (zefau) Improved error log in the admin panel

### 0.4.4 (2018-11-22)
- (zefau) Updated admin panel and added instructions for alexa integration (loading from Github README.md)
- (zefau) Bug fixes: Fixed an issue regarding certificates when using HTTPs

### 0.4.3 (2018-11-21)
- (zefau) Bug fixes: Fixed incorrect interpretation of https, when only http was configured

### 0.4.2 (2018-11-18)
- (zefau) Bug fixes

### 0.4.1 (2018-11-18)
- (zefau) replaced Promises (async/await) with callback to be backward compatibility with Node.js v6 (and v4)

### 0.4.0 (2018-11-17)
- (zefau) support for HTTPs is now working
- (zefau) Redesign of the admin interface

### 0.3.5 (2018-11-05)
- (zefau) added description and roles for states

### 0.3.4 (2018-11-04)
- (zefau) Code improvements

### 0.3.3 (2018-11-04)
- (zefau) added HTTPs support for webhooks (which however does not seem to be supported by the Nello API)

### 0.3.2 (2018-11-03)
- (zefau) created dedicated Github / npm repository for the javascript implementation of the nello.io API (https://github.com/Zefau/nello.io) and thus changed dependency packages

### 0.3.1 (2018-11-02)
- (zefau) fixed https://github.com/Zefau/ioBroker.nello/issues/2

### 0.3.0 (2018-10-31)
* (zefau) added support for webhooks (receiving events / notifications)

### 0.2.0 (2018-10-30)
* (zefau) added support for time windows (only retrieving)

### 0.1.0 (2018-10-28)
* (zefau) initial release (list all your doors and open them)


## License
The MIT License (MIT)

Copyright (c) 2018 Zefau <zefau@mailbox.org>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
