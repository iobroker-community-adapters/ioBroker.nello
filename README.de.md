![Logo](https://raw.githubusercontent.com/Zefau/ioBroker.nello/master/admin/nello.png)
# ioBroker.nello
nello one verbindet die Gegensprechanlage mit dem Smartphone und dem hauseigenen Netzwerk. Dieser Adapter verbindet nello one mit dem ioBroker über die offizielle API (https://nellopublicapi.docs.apiary.io/).

[![NPM version](http://img.shields.io/npm/v/iobroker.nello.svg)](https://www.npmjs.com/package/iobroker.nello)
[![Travis CI](https://travis-ci.org/Zefau/ioBroker.nello.svg?branch=master)](https://travis-ci.org/Zefau/ioBroker.nello)
[![Downloads](https://img.shields.io/npm/dm/iobroker.nello.svg)](https://www.npmjs.com/package/iobroker.nello)

[![NPM](https://nodei.co/npm/iobroker.nello.png?downloads=true)](https://nodei.co/npm/iobroker.nello/)

## [English Readme / Englische Anleitung](https://github.com/Zefau/ioBroker.nello/blob/master/README.md)

**Inhaltsverzeichnis**
1. [Installation (Schnellinstallation)](https://github.com/Zefau/ioBroker.nello/blob/master/README.de.md#schnellinstallation)
2. [Installation (Erweiterte Installation)](https://github.com/Zefau/ioBroker.nello/blob/master/README.de.md#erweiterte-installation)
3. [Smart Home / Alexa integration using ioBroker.javascript](https://github.com/Zefau/ioBroker.nello#smart-home--alexa-integration-using-iobrokerjavascript)
   1. [Open door using Alexa](https://github.com/Zefau/ioBroker.nello#open-door-using-alexa)
   2. [Let Alexa inform you about door ring](https://github.com/Zefau/ioBroker.nello#let-alexa-inform-you-about-door-ring)
4. [Changelog](https://github.com/Zefau/ioBroker.nello#changelog)
5. [Lizenz](https://github.com/Zefau/ioBroker.nello/blob/master/README.de.md#lizenz)


## Installation
### Schnellinstallation
The nello auth API is responsible for authentication of all nello client apps. This service follows OAuth2 as an authentication scheme to authenticate an app/user. For further information about the OAuth2 standard, please check here: https://oauth.net/2/.
To use this service, client credentials must be obtained from the nello auth admin UI located at: https://auth.nello.io/admin. Please not that for the time being you can only get one pair of client_id and client_secret. They consist of a client_id and a client_secret.

1. Generiere eine Client ID und ein Client Secret über die Website https://auth.nello.io/admin
2. In den ioBroker.nello adapter Einstellungen die Client ID und das Client Secret eintragen
3. Den Button "Get Token" nutzen, um einen Token zu generieren
4. Speichern und den Adapter genießen

This quick setup will retrieve your locations (all available doors) from the nello API including the respective address. Furthermore, the assigned time windows of the locations will be retrieved. Additionally, you may open the door with this basic setup.
To receive events (door bell rings), you have to follow the advanced setup.

#### Protokollierung
Wenn die Schnellinstallation erfolgreich war, erscheinen die folgenden Einträge in der ioBroker Protokollierung:
```
nello.0	2018-11-24 21:29:48.132	info	Updating time windows of location XXXXX.
nello.0	2018-11-24 21:29:47.905	info	Updating location: {"location_id":"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX","address":{"number":"X","country":"XXXXX","street":"XXXXX ","zip":"XXXXX","city":"XXXXX","state":""}}
nello.0	2018-11-24 21:29:47.342	info	starting. Version X.X.X in /opt/iobroker/node_modules/iobroker.nello, node: vX.XX.X
```

#### Objekte
Wenn die Schnellinstallation erfolgreich war, erscheinen die Türen jeweils als Gerät im Baum der Objekte unter "**nello.0.**". Das Format einer Tür ist _xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_. Innerhalb eines jeden Geräts werden die folgenden Kanäle und Objekte angelegt:

| Kanal | Objekt | Beschreibung |
|:------- |:----- |:------------- |
| address | - | Address data of the location |
| address | address | Full address of the location |
| address | city | City of the location |
| address | country | Country of the location |
| address | state | State  of the location |
| address | street | Street with number of the location |
| address | streetName | Street name of the location |
| address | streetNumber | Street number of the location |
| address | zip | ZIP code of the location |
| timeWindows | - | Time Windows of the location |
| timeWindows | indexedTimeWindows | Index of all time windows |
| timeWindows.0000000000000000000 | - | Time Window: Description of the time window |
| timeWindows.0000000000000000000 | enabled | State whether time window is enabled |
| timeWindows.0000000000000000000 | icalObj | JSON object of the calendar data |
| timeWindows.0000000000000000000 | icalRaw | Text of the calendar data in iCal format |
| timeWindows.0000000000000000000 | id | ID of the time window |
| timeWindows.0000000000000000000 | image | (not in used) |
| timeWindows.0000000000000000000 | name | Name of the time window |
| timeWindows.0000000000000000000 | state | State |
| - | &#95;openDoor | Open door of location XXXXX |
| - | id | ID of location XXXXX |
| - | refreshedDateTime | Last update (DateTime) of location XXXXX |
| - | refreshedTimestamp | Last update (Timestamp) of location XXXXX |

**Remark: You will _only_ see those states if you have successfully quick-setup ioBroker.nello!**


### Erweiterte Installation
To received events (door bell rings) you have to provide an external URL (with port) in the ioBroker.nello adapter settings.
This URL (incl. port) is sent to the nello API and registered. In case a door bell ring is registered by the API, the API will push this information to the provided URL. Please refer to https://en.wikipedia.org/wiki/Webhook for more information.
If you no DynDNS address and no idea what the shit I'm talking about, please refer to https://www.howtogeek.com/66438/how-to-easily-access-your-home-network-from-anywhere-with-ddns/.

1. Place the external DynDNS address including a port of your choice in the ioBroker.nello adapter settings
2. Open the port of your choice in your router and route it to the ioBroker
3. Done. You will now have additional states in your nello tree within the channel "events" and all events are written to a state named "feed".

#### Protokollierung
If you successfully advanced-setup ioBroker.nello, you will additionally find the following in the ioBroker Log:
```
nello.0	2018-11-24 21:29:48.220	info	Listener attached to uri https://XXXX.XXXXX.XX:YYYY.
```

In case an event has been recognized by the webook listener, you will find any of those entries in the ioBroker Log:
```
nello.0	2018-11-24 21:38:48.322	info	Received data from the webhook listener (action -deny-).
```
**deny**: When nello detects a bell ring, but neither a Time Window nor a Homezone Event caused the door to be opened.

```
nello.0	2018-11-24 21:38:48.322	info	Received data from the webhook listener (action -swipe-).
```
**swipe**: When the door opens by an authorized user.

```
nello.0	2018-11-24 21:38:48.322	info	Received data from the webhook listener (action -geo-).
```
**geo**: When the door is opened because of the Homezone Unlock feature (with a bell ring).

```
nello.0	2018-11-24 21:38:48.322	info	Received data from the webhook listener (action -tw-).
```
**tw**: When the door is opened because of a Time indow (with a bell ring).

#### Objekte
If you successfully advanced-setup ioBroker.nello, the following additional channels and states are created:

| Channel | State | Description |
|:------- |:----- |:------------- |
| events | - | Events of the location |
| events | feed | Activity feed / Event history |
| events | refreshedDateTime | DateTime of the last event |
| events | refreshedTimestamp | Timestamp of the last event |

**Remark: You will _only_ see those states if you have successfully advanced-setup ioBroker.nello AND a first event as been recognized (someone rang on your)!**

The "feed" state will provide a JSON of all events registered by the webhook. This will be an array of objects, where each object provides the following indizes (for details see https://nellopublicapi.docs.apiary.io/#reference/0/locations-collection/add-/-update-webhook):
- **action**: deny, swipe, tw or geo
- **data**:
    - location_id
    - timestamp
    - user_id (only actions swipe, tw or geo)
    - name (only actions swipe, tw or geo)


## Smart Home / Alexa Integration mit ioBroker.javascript
Some examples of a possible integration within your smart home.

### Tür mit Alexa öffnen
This requires the ioBroker adapter ioBroker.cloud (https://github.com/ioBroker/ioBroker.cloud).

Save the following function within a script in the "global" folder in the "Scripts" tab of ioBroker:

```javascript
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
```javascript
cloud('nello.0.#YOUR DOOR ID#._openDoor', 'Tür öffnen');
```
Replace **#YOUR DOOR ID#** (also replace #) with the ID of the door you want to open. You find the ID in the ioBroker.nello state tree ("Objects" tab of ioBroker).

Eventually, search / discover new devices in your Alexa app and create a routine in the Alexa app (e.g. "Alexa, open door") and assign the newly discovered state to it. Finished! Now you may tell Alexa to open your door for you.

### Über das Türklingeln durch Alexa infomieren lassen
Diese Funktionalität benötigt den ioBroker Adapter ioBroker.alexa2 (https://github.com/Apollon77/ioBroker.alexa2).

In order to use the voice output of Alexa we define a function ```say```. Place the following function in a script in the "global" folder of ioBroker.javascript (you may place it in the same one as above). **IMPORTANT**: Replace #YOUR ALEXA ID# (also replace #) with your Alexa ID. You may find the Alexa ID in the Objects tree of ioBroker ```alexa2.0.Echo-Devices```.

```javascript
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

You can use this function within ioBroker.javascript to say a phrase using Alexa  ```say('Hello World')``` or ```say('Hello World', ['#YOUR ALEXA ID 1#', '#YOUR ALEXA ID 2#'])``` for voice output from multiple devices.

Create a script in the "common" folder of ioBroker.javascript (or use the one you created above) and add the following listener to it:
```javascript
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


## Lizenz
Die MIT Lizenz (MIT)

Copyright (c) 2018 Zefau <zefau@mailbox.org>

Hiermit wird unentgeltlich jeder Person, die eine Kopie der Software und der zugehörigen Dokumentationen (die "Software") erhält, die Erlaubnis erteilt, sie uneingeschränkt zu nutzen, inklusive und ohne Ausnahme mit dem Recht, sie zu verwenden, zu kopieren, zu verändern, zusammenzufügen, zu veröffentlichen, zu verbreiten, zu unterlizenzieren und/oder zu verkaufen, und Personen, denen diese Software überlassen wird, diese Rechte zu verschaffen, unter den folgenden Bedingungen:

Der obige Urheberrechtsvermerk und dieser Erlaubnisvermerk sind in allen Kopien oder Teilkopien der Software beizulegen.

DIE SOFTWARE WIRD OHNE JEDE AUSDRÜCKLICHE ODER IMPLIZIERTE GARANTIE BEREITGESTELLT, EINSCHLIEẞLICH DER GARANTIE ZUR BENUTZUNG FÜR DEN VORGESEHENEN ODER EINEM BESTIMMTEN ZWECK SOWIE JEGLICHER RECHTSVERLETZUNG, JEDOCH NICHT DARAUF BESCHRÄNKT. IN KEINEM FALL SIND DIE AUTOREN ODER COPYRIGHTINHABER FÜR JEGLICHEN SCHADEN ODER SONSTIGE ANSPRÜCHE HAFTBAR ZU MACHEN, OB INFOLGE DER ERFÜLLUNG EINES VERTRAGES, EINES DELIKTES ODER ANDERS IM ZUSAMMENHANG MIT DER SOFTWARE ODER SONSTIGER VERWENDUNG DER SOFTWARE ENTSTANDEN. 
