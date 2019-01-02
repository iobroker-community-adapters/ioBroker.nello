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
3. [Smart Home / Alexa Integration mit ioBroker.javascript](https://github.com/Zefau/ioBroker.nello/blob/master/README.de.md#smart-home--alexa-integration-mit-iobrokerjavascript)
   1. [Tür mit Alexa öffnen](https://github.com/Zefau/ioBroker.nello/blob/master/README.de.md#t%C3%BCr-mit-alexa-%C3%B6ffnen)
   2. [Über das Türklingeln durch Alexa infomieren lassen](https://github.com/Zefau/ioBroker.nello/blob/master/README.de.md#%C3%BCber-das-t%C3%BCrklingeln-durch-alexa-infomieren-lassen)
4. [Changelog (nur in englischer Readme)](https://github.com/Zefau/ioBroker.nello#changelog)
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
| timeWindows | createTimeWindow | JSON Objekt um ein neues Zeitfenster anzulegen ([Dokumentation](#anlegen-eines-zeitfensters-über-timewindowscreatetimewindow)) |
| timeWindows.0000000000000000000 | - | Zeitfenster |
| timeWindows.0000000000000000000 | enabled | Status, ob das Zeitfenster aktiviert ist |
| timeWindows.0000000000000000000 | icalObj | JSON Objekt der Kalenderdaten |
| timeWindows.0000000000000000000 | icalRaw | Text / String der Kalenderdaten im iCal Format |
| timeWindows.0000000000000000000 | id | ID des Zeitfensters |
| timeWindows.0000000000000000000 | image | (nicht in Benutzung) |
| timeWindows.0000000000000000000 | name | Name des Zeitfensters |
| timeWindows.0000000000000000000 | state | Status |
| timeWindows.0000000000000000000 | deleteTimeWindow | Button zum Löschen des Zeitfensters |
| - | &#95;openDoor | Button zum Öffnen der Tür |
| - | id | ID des nello Orts |
| - | refreshedDateTime | Letzte Aktualisierung (Datum) im Adapter |
| - | refreshedTimestamp | Letzte Aktualisierung (Timestamp) im Adapter |

**ACHTUNG: Die dargestellten Objekte werden _nur_ dargestellt, wenn die Schnellinstallation erfolgreich war!**


### Erweiterte Installation
#### Option 1: ioBroker.cloud / ioBroker.iot eigene URL (empfohlen)
Um Events (z.B. Türklingeln) zu empfangen, ist es empfohlen entweder ioBroker.cloud oder ioBroker.iot zu verwenden.
Der ioBroker.cloud / ioBroker.iot Adpater empfängt die Events von nello und schreibt diese in einen State, der dann durch den ioBroker.nello Adapter ausgelesen wird.

1. In den Einstellungen des ioBroker.cloud oder ioBroker.iot Adapters in die Registerkarte _Services and IFTTT_ gehen.
2. Den Begriff "_nello_" in die "_White list für Services_" aufnehmen und den Link für eigene Services ("_Benutze folgende Link für einen eigenen Service_") kopieren.
3. Im Link den Begriff ```custom_<SERVICE_NAME>``` mit dem Service Namen ```custom_nello``` ersetzen (sicherstellen, dass der Begriff hinter ```custom_``` den Begriff der Whitelist aus Schritt #2 entspricht). Weiterhin den Abschnitt ```&data=<SOME_TEXT>``` entfernen, da dieser nicht notwendig ist.
4. In die Einstellungen des nello Adapters wechseln und dort den Link unter "_ioBroker.iot Service URL_" (in Option 1) einfügen.
5. Sicherstellen, dass der State in "_ioBroker.iot nello State_" korrekt ist. Ein State mit der Bezeichnung ```custom_nello``` (abhängig des spezifisch vergebenen Service-Namens aus Schritt #3) ist in den ioBroker Objekten entweder unter ```cloud.0.services.custom_nello``` oder ```iot.0.services.custom_nello``` zu finden. Den richtigen State im Feld "_ioBroker.iot nello State_" eintragen.

#### Option 2: DynDNS URL
Um Events (z.B. Türklingeln) zu empfangen, kann alternativ eine externe DynDNS URL / Adresse (inklusive Port) in den ioBroker.nello Adapter Einstellungen hinterlegt werden. Hierfür ist eine DynDNS URL und eine Portöffnung im Router notwendig. Eine DynDNS URL / Adresse ist eine Internetadresse, die auf die lokale IP weiterleitet (siehe auch https://de.wikipedia.org/wiki/Dynamisches_DNS). Diese DynDNS URL / Adresse (inklusive Port) wird dann durch den Adapter an die nello API geschickt und dort registriert (dies nennt sich Webhook, siehe auch https://de.wikipedia.org/wiki/WebHooks). Wenn es klingelt oder die Tür geöffnet wird, schickt die nello API eine Push-Nachricht an die angegebene URL. 

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

## Benutzung / Aktionen
### Tür öffnen
Zum Öffnen der Tür, muss der Button ```_openDoor``` betätigt werden.

### Anlegen eines Zeitfensters 
Um ein Zeitfenster anzulegen, müssen die Daten in den State ```timeWindows.createTimeWindow``` eingefügt werden. Zum Anlegen eines Zeitfensters wird folgendes Format erwartet:

```
{"name":"<NAME>","ical":"<iCal-String>"}
```
Format des iCal-String ist in der Nello-API-Dokumentation zu entnehmen (https://nellopublicapi.docs.apiary.io/#reference/0/locations-collection/create-a-new-time-window). **Wichtig ist die Trennung der einzelnen Elemente mit ```\r\n```.**

Beispiel eines Zeitfensters:
```
{"name":"Putzfrau","ical":"BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTSTART:20190101T163000Z\r\nDTEND:20190101T170000Z\r\nSUMMARY:Putzfrau\r\nEND:VEVENT\r\nEND:VCALENDAR"}
```

### 
Um ein Zeitfenster zu löschen, muss der entsprechenden Button im Objektbaum des Zeitfensters betätigt werden.


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

Um die Sprachausgabe von Alexa zu nutzen, ist die Funktion ```say``` zu definieren. Hierzu ist die folgenden Funktion als Skript im "global" Ordner von ioBroker.javascript zu hinterlegen (es kann dasselbe Skript sein, wie oben bereits genutzt).
**WICHTIG**: Die Angabe #YOUR ALEXA ID# (inklusive dem #) ist mit der Alexa ID zu setzen. Die Alexa ID ist im Objekt-Baum unter ```alexa2.0.Echo-Devices``` zu finden (der Name des Ordner ist die ID).

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

Die Funktion kann nun dazu genutzt werden, um mit ioBroker.javascript eine Sprachausgabe zu erzeugen, z.B. durch ```say('Hello World')``` oder ```say('Hello World', ['#YOUR ALEXA ID 1#', '#YOUR ALEXA ID 2#'])```, für eine Ausgabe mit mehreren Alexa Geräten.

Nun ist ein Skript im "common" Ordner zu erstellen (es kann das zuvor verwendete genutzt werden) und der folgende Listener ist hinzuzufügen:
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
Abhängig der Art des Events wird Alexa nun darüber informieren, dass die Tür geöffnet wurde bzw. das Klingeln abgelehnt wurde.
Die Angabe **#YOUR DOOR ID#** (inklusive dem #) ist mit der ID der Tür zu ersetzen.


## Lizenz
Die MIT Lizenz (MIT)

Copyright (c) 2018 Zefau <zefau@mailbox.org>

Hiermit wird unentgeltlich jeder Person, die eine Kopie der Software und der zugehörigen Dokumentationen (die "Software") erhält, die Erlaubnis erteilt, sie uneingeschränkt zu nutzen, inklusive und ohne Ausnahme mit dem Recht, sie zu verwenden, zu kopieren, zu verändern, zusammenzufügen, zu veröffentlichen, zu verbreiten, zu unterlizenzieren und/oder zu verkaufen, und Personen, denen diese Software überlassen wird, diese Rechte zu verschaffen, unter den folgenden Bedingungen:

Der obige Urheberrechtsvermerk und dieser Erlaubnisvermerk sind in allen Kopien oder Teilkopien der Software beizulegen.

DIE SOFTWARE WIRD OHNE JEDE AUSDRÜCKLICHE ODER IMPLIZIERTE GARANTIE BEREITGESTELLT, EINSCHLIEẞLICH DER GARANTIE ZUR BENUTZUNG FÜR DEN VORGESEHENEN ODER EINEM BESTIMMTEN ZWECK SOWIE JEGLICHER RECHTSVERLETZUNG, JEDOCH NICHT DARAUF BESCHRÄNKT. IN KEINEM FALL SIND DIE AUTOREN ODER COPYRIGHTINHABER FÜR JEGLICHEN SCHADEN ODER SONSTIGE ANSPRÜCHE HAFTBAR ZU MACHEN, OB INFOLGE DER ERFÜLLUNG EINES VERTRAGES, EINES DELIKTES ODER ANDERS IM ZUSAMMENHANG MIT DER SOFTWARE ODER SONSTIGER VERWENDUNG DER SOFTWARE ENTSTANDEN. 
