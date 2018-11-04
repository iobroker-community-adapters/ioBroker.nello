/*global systemDictionary:true */
'use strict';

systemDictionary = {
	"auth": {
		"en": "Authentication Credentials",
		"de": "Authentifizierung"
	},
	"auth_info": {
		"en": "The nello auth API is responsible for authentication of all nello client apps. This service follows OAuth2 as an authentication scheme to authenticate an app/user. For further information about the OAuth2 standard, please check here: <a href='https://oauth.net/2/'>https://oauth.net/2/</a><br /> To use this service, client credentials must be obtained from the nello auth admin UI located at: <a href='https://auth.nello.io/admin'>https://auth.nello.io/admin</a>. Please not that for the time being you can only get one pair of client_id and client_secret. They consist of a client_id and a client_secret.",
		"de": ""
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
		"en": "Token Type (Readonly)",
		"de": "Token Typ (nur lesend)"
	},
    "access_token": {
		"en": "Access Token (Readonly)",
		"de": "Access Token (nur lesend)"
	},
	"token_info": {
		"en": "Fill in both Client ID / Client Secret in order to generate token.",
		"de": "Trage Client ID / Client Secret ein, um einen neuen Token zu generieren."
	},
	"button_token": {
		"en": "Get token",
		"de": "Token generieren"
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
