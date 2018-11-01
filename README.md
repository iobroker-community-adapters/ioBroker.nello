![Logo](admin/nello.png)
# ioBroker.nello
nello one connects your intercom with your smartphone and Wi-Fi. This adapter connects your nello one to ioBroker using the official API (https://nellopublicapi.docs.apiary.io/).


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


## Changelog

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
