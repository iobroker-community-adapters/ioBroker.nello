/*global systemDictionary:true */
'use strict';

systemDictionary = {
	"tab_config": {
		"en": "Configuration",
		"de": "Einstellungen"
	},
	"tab_alexa": {
		"en": "Alexa integration",
		"de": "Alexa Integration"
	},
	"tab_info": {
		"en": "Information",
		"de": "Informationen"
	},
	"message_connecting": {
		"en": "Connecting to adapter..",
		"de": "Verbinde zum Adapter.."
	},
	"message_noconnection": {
		"en": "No connection to adapter! Please start adapter first.",
		"de": "Keine Verbindung zum Adapter! Bitte zunächst den Adapter starten."
	},
	"message_connected": {
		"en": "Connected to adapter. Retrieving token..",
		"de": "Verbunden zum Adapter. Lade Token.."
	},
	"message_missing-clientid": {
		"en": "Fill in Client ID and Client Secret to generate token!",
		"de": "Zunächst Client ID und Client Secret eintragen, um einen Token zu generieren!"
	},
	"message_error-token": {
		"en": "Could not fetch token!",
		"de": "Token konnte nicht abgerufen werden!"
	},
	"auth": {
		"en": "Authentication Credentials",
		"de": "Authentifizierung"
	},
    "main": {
		"en": "Main Settings",
		"de": "Einstellungen"
	},
    "client_id": {
		"en": "Client ID",
		"de": "Client ID"
	},
    "client_secret": {
		"en": "Client Secret",
		"de": "Client Secret"
	},
    "token_type": {
		"en": "Token Type",
		"de": "Token Typ"
	},
    "access_token": {
		"en": "Access Token",
		"de": "Access Token"
	},
	"token_fillin": {
		"en": "Fill in an existing token that has been generated elsewhere or select button &quot;Get new token&quot;.",
		"de": "Trage einen bereits vorhandenen Token ein, der woanders generiert wurde oder wähle den Button &quot;Neuen Token generieren&quot;."
	},
	"token_APIinfo": {
		"en": "To use the nello API service and generate a token, client credentials must be obtained from the nello auth admin UI located at: <a href='https://auth.nello.io/admin'>https://auth.nello.io/admin</a>. Please not that for the time being you can only get one pair of client_id and client_secret. They consist of a client_id and a client_secret.",
		"de": "Um die nello API nutzen und einen Token generieren zu können, muss vorher eine Client ID und ein Client Secret über <a href='https://auth.nello.io/admin'>https://auth.nello.io/admin</a> (manuell) generiert werden."
	},
	"token_fillInClientId": {
		"en": "Fill in both Client ID / Client Secret and press &quot;Get new token&quot; in order to generate a new token.",
		"de": "Trage Client ID / Client Secret und wähle &quot;Neuen Token generieren&quot;, um einen neuen Token zu erhalten."
	},
	"button_closeModal": {
		"en": "Cancel",
		"de": "Abbrechen"
	},
	"button_getToken": {
		"en": "Get new token",
		"de": "Neuen Token generieren"
	},
	"timewindows": {
		"en": "Time Window Settings",
		"de": "Einstellungen für Zeitfenster"
	},
	"timewindows_info": {
		"en": "Time for refreshing the time windows of all locations (in seconds). If set to 0, time windows will only be refreshed on adapter startup.",
		"de": "Intervall in Sekunden, nach dem die eingestellten Zeitfenster aktualisiert werden. Wenn auf 0 eingestellt, werden die Zeitfenster nur bei einem Adapter Start aktualisiert."
	},
	"refresh": {
		"en": "Refresh (in seconds)",
		"de": "Aktualisierung (in Sekunden)"
	},
	"events": {
		"en": "Subscribe / listen to events (Configuration of the webhook)",
		"de": "Events abonnieren (Konfiguration des Webhooks)"
	},
	"events_info": {
		"en": "Listening to events allows you to receive a door ring or a door opening action. Possible events are swipe, geo, tw and deny (documented here <a href='https://nellopublicapi.docs.apiary.io/#reference'>https://nellopublicapi.docs.apiary.io/#reference</a>).",
		"de": "Events abonnieren ermöglichen es, ein Türklingeln oder Türöffnen zu empfangen. Mögliche Events sind swipe, geo, tw und deny (im Detail unter <a href='https://nellopublicapi.docs.apiary.io/#reference'>https://nellopublicapi.docs.apiary.io/#reference</a> dokumentiert)."
	},
	"events_max_count": {
		"en": "Maximum number of historicized events",
		"de": "Anzahl an maximal historisierte Events"
	},
	"events_max_count_info": {
		"en": "Maximum number of historicized events",
		"de": "Anzahl an maximal historisierten Events"
	},
	"webhook_iobroker": {
		"en": "Option 1: ioBroker.cloud/iot (recommended)",
		"de": "Option 1: ioBroker.cloud/iot (empfohlen)"
	},
	"webhook_dyndns": {
		"en": "Option 2: DynDNS Address",
		"de": "Option 2: DynDNS Adresse"
	},
	"iobroker_info": {
		"en": "Use iobroker.cloud or iobroker.iot Adapter to receive events from your nello. <a target='_blank' href='https://github.com/Zefau/ioBroker.nello#advanced-setup'>See setup instructions here</a>.",
		"de": "Benutze den iobroker.cloud oder iobroker.iot Adapter, um Events von nello zu empfangen. <a target='_blank' href='https://github.com/Zefau/ioBroker.nello/blob/master/README.de.md#erweiterte-installation'>Siehe Anleitung zur Installation hier</a>."
	},
	"iobroker": {
		"en": "ioBroker.iot Service URL",
		"de": "ioBroker.iot Service URL"
	},
	"iot": {
		"en": "ioBroker.iot nello State",
		"de": "ioBroker.iot nello Objekt"
	},
	"dyndns_info": {
		"en": "Please configure the external DNS-URL and the port to listen to events sent by nello. Furthermore, remember to open the port on your router.",
		"de": "Zum Abonnieren von Events bitte die externe DNS-URL sowie den Port angeben, zu dem nello die Benachrichtungen schickt. Außerdem muss der Port auf dem Router weitergeleitet werden."
	},
	"uri": {
		"en": "URL (format www.domain.com:port)",
		"de": "URL (Format www.domain.com:port)"
	},
	"ssl": {
		"en": "Secure Connection (HTTPS)",
		"de": "Sichere Verbindung (HTTPS)"
	},
	"selfSigned": {
		"en": "Self Signed Certificate",
		"de": "Selbst signiertes Zertifikat"
	},
	"public": {
		"en": "Public Certificate",
		"de": "Öffentliches Zertifikat"
	},
	"private": {
		"en": "Private Key / Certificate",
		"de": "Privater Schlüssel / Zertifikat"
	},
	"chained": {
		"en": "Chained / Intermediate Certificate",
		"de": "Chained / Intermediate Zertifikat"
	},
};
