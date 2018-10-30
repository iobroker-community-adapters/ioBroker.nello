![Logo](admin/nello.png)
# ioBroker.nello
nello one connects your intercom with your smartphone and Wi-Fi. This adapter connects your nello one to ioBroker using the official API (https://nellopublicapi.docs.apiary.io/).

## Setup instructions
The nello auth API is responsible for authentication of all nello client apps. This service follows OAuth2 as an authentication scheme to authenticate an app/user. For further information about the OAuth2 standard, please check here: https://oauth.net/2/.
To use this service, client credentials must be obtained from the nello auth admin UI located at: https://auth.nello.io/admin. Please not that for the time being you can only get one pair of client_id and client_secret. They consist of a client_id and a client_secret.

1. Generate Client ID and Client Secret on https://auth.nello.io/admin
2. In the ioBroker.nello adapter settings, fill in both Client ID / Client Secret
3. Press the button "Get Token" to generate a token
4. Save and enjoy the adapter


## Changelog

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
