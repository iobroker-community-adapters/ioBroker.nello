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
1. Generiere eine Client ID und ein Client Secret über die Website https://auth.nello.io/admin
2. In den ioBroker.nello adapter Einstellungen die Client ID und das Client Secret eintragen
3. Den Button "Get Token" nutzen, um einen Token zu generieren
4. Speichern und den Adapter genießen

Die Schnellinstallation ermöglicht es, alle in nello eingestellten Türen mit den Adressdaten zu laden. Außerdem werden die eingestellten Zeitfenster geladen und es kann mit ioBroker die Tür geöffnet werden.
Um Events / Ereignisse (z.B. Türklingeln) zu empfangen, muss die erweiterte Installation durchgeführt werden.

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
| address | - | Adressdaten des nello Orts |
| address | address | Komplette Adresse des nello Orts |
| address | city | Stadt des nello Orts |
| address | country | Land des nello Orts |
| address | state | Bundesland des nello Orts |
| address | street | Straße (inkl. Nummer) des nello Orts |
| address | streetName | Straßenname des nello Orts |
| address | streetNumber | Straßennummer des nello Orts |
| address | zip | Postleitzahl (PLZ) des nello Orts |
| timeWindows | - | Zeitfenster des nello's |
| timeWindows | indexedTimeWindows | Index / Liste aller vorhandenen Zeitfenster |
| timeWindows.0000000000000000000 | - | Zeitfenster |
| timeWindows.0000000000000000000 | enabled | Status, ob das Zeitfenster aktiviert ist |
| timeWindows.0000000000000000000 | icalObj | JSON Objekt der Kalenderdaten |
| timeWindows.0000000000000000000 | icalRaw | Text / String der Kalenderdaten im iCal Format |
| timeWindows.0000000000000000000 | id | ID des Zeitfensters |
| timeWindows.0000000000000000000 | image | (nicht in Benutzung) |
| timeWindows.0000000000000000000 | name | Name des Zeitfensters |
| timeWindows.0000000000000000000 | state | Status |
| - | &#95;openDoor | Button zum Öffnen der Tür |
| - | id | ID des nello Orts |
| - | refreshedDateTime | Letzte Aktualisierung (Datum) im Adapter |
| - | refreshedTimestamp | Letzte Aktualisierung (Timestamp) im Adapter |

**ACHTUNG: Die dargestellten Objekte werden _nur_ dargestellt, wenn die Schnellinstallation erfolgreich war!**


### Erweiterte Installation
Um Events (z.B. Türklingeln) zu empfangen, muss eine externe DynDNS URL / Adresse (inklusive Port) in den ioBroker.nello Adapter Einstellungen hinterlegt werden. Eine DynDNS URL / Adresse ist eine Internetadresse, die auf die lokale IP weiterleitet (siehe auch https://de.wikipedia.org/wiki/Dynamisches_DNS). Diese DynDNS URL / Adresse (inklusive Port) wird dann durch den Adapter an die nello API geschickt und dort registriert (dies nennt sich Webhook, siehe auch https://de.wikipedia.org/wiki/WebHooks). Wenn es klingelt oder die Tür geöffnet wird, schickt die nello API eine Push-Nachricht an die angegebene URL. 

Wie eine externe URL bzw. eine DynDNS Adresse einzurichten ist, kann unter https://www.digital-eliteboard.com/threads/einrichtung-eines-no-ip-accounts.193317/ nachgelesen werden.

1. Die externe DynDNS Adresse inklusive (beliebigen) Port in the ioBroker.nello Adapter Einstellungen eintragen
2. Den beliebig gewählten Portim Router freigeben und auf die lokale ioBroker IP weiterleiten
3. Fertig. Ab jetzt werden die Events von ioBroker.nello empfangen und ausgelesen. Es erscheinen nun weitere Objekte im ioBroker Baum. Alle Events werden in das Objekt "feed" geschrieben.

#### Protokollierung
Wenn die erweiterte Installation erfolgreich war, erscheinen zusätzlich die folgenden Einträge in der ioBroker Protokollierung:
```
nello.0	2018-11-24 21:29:48.220	info	Listener attached to uri https://XXXX.XXXXX.XX:YYYY.
```

Wenn der Webhook ein Event registriert, erscheint der folgende Eintrag in der ioBroker Protokollierung:
```
nello.0	2018-11-24 21:38:48.322	info	Received data from the webhook listener (action -deny-).
```
**deny**: Es wurde geklingelt, aber weder ein Zeitfenster noch eine Heimzone hat die Tür geöffnet (das Klingeln wurde abgelehnt und die Tür nicht geöffnet).

```
nello.0	2018-11-24 21:38:48.322	info	Received data from the webhook listener (action -swipe-).
```
**swipe**: Die Tür wurde durch einen berechtigten Benutzer geöffnet.

```
nello.0	2018-11-24 21:38:48.322	info	Received data from the webhook listener (action -geo-).
```
**geo**: Die Tür wurde durch die Funktionalität "Heimzone" geöffnet.

```
nello.0	2018-11-24 21:38:48.322	info	Received data from the webhook listener (action -tw-).
```
**tw**: Die Tür wurde durch ein Zeitfenster geöffnet.

#### Objekte
Wenn die erweiterte Installation erfolgreich war, erscheinen folgenden zusätzlichen Objekte im Baum der Objekte unter "**nello.0.**":

| Kanal | Objekt | Beschreibung |
|:------- |:----- |:------------- |
| events | - | Events des nello Orts |
| events | feed | Aktivitätsfeed / alle Events |
| events | refreshedDateTime | Datum des letzten Events |
| events | refreshedTimestamp | Timestamp des letzten Events |

**ACHTUNG: Die dargestellten Objekte werden _nur_ dargestellt, wenn die erweiterte Installation erfolgreich war UND der erste Event erkennt wurde (es also geklingelt wurde)!**

Das "feed"-Objekt stellt eine JSON-Zeichenkette aller registrierten Events zur Verfügung. Es handelt sich hierbei um ein Array der Objekte, wobei jedes Objekt die folgenden Indizes hat (für Details siehe https://nellopublicapi.docs.apiary.io/#reference/0/locations-collection/add-/-update-webhook):
- **action**: deny, swipe, tw oder geo
- **data**:
    - location_id
    - timestamp
    - user_id (nur für die Events swipe, tw or geo)
    - name (nur für die Events swipe, tw or geo)


## Smart Home / Alexa Integration mit ioBroker.javascript
Nachfolgend einige Beispiele der Integration in das eigene Smart-Home.

### Tür mit Alexa öffnen
Diese Funktionalität benötigt den ioBroker Adapter ioBroker.cloud (https://github.com/ioBroker/ioBroker.cloud).

Die folgende Funktion ist im Ordner "global" (im "Skripts" Bereich von ioBroker) zu speichern:

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

Diese Funktion kann genutzt werden um jedes Objekt in ioBroker für die ioBroker.cloud zu registrieren und damit mit Alexa zu nutzen.
**WICHTIG**: In den Adapter-Einstellungen von ioBroker.javascript muss "Enable command setObject" aktiviert sein!

Nun muss das folgende neue Skript im Ordner "common" angelegt werden:

```javascript
cloud('nello.0.#YOUR DOOR ID#._openDoor', 'Tür öffnen');
```
Die Angabe **#YOUR DOOR ID#** (inklusive dem #) ist mit der ID der Tür, die geöffnet werden soll, zu ersetzen. Diese ID ist im ioBroker.nello Objekt-Baum zu finden.

Nun ist die Suche nach neuen Geräte in der Alexa App anzustoßen. Mit dem neu gefundenen Gerät kann nun eine Routine (z.B. "Alexa, Tür öffnen") angelegt werden. Fertig! Nun kann Alexa genutzt werden, um die Tür zu öffnen.

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
