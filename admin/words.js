/*global systemDictionary:true */
'use strict';

systemDictionary = {
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
	"events": {
		"en": "Subscribe / listen to events (Configuration of the webhook)",
		"de": "Events abonnieren (Konfiguration des Webhooks)"
	},
	"events_info": {
		"en": "Please configure the external DNS-URL and the port to listen to events sent by nello. Possible events are swipe, geo, tw and deny (documented here <a href='https://nellopublicapi.docs.apiary.io/#reference'>https://nellopublicapi.docs.apiary.io/#reference</a>). Furthermore, remember to open the port on your router.",
		"de": "Zum Abonnieren von Events bitte die externe DNS-URL sowie den Port angeben, zu dem nello die Benachrichtungen schickt. Mögliche Events sind swipe, geo, tw und deny (im Detail unter <a href='https://nellopublicapi.docs.apiary.io/#reference'>https://nellopublicapi.docs.apiary.io/#reference</a> dokumentiert). Außerdem muss der Port auf dem Router weitergeleitet werden."
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
	}
};
