# Scarlet
Scarlet is a custom bancho implementation, this handles:
- Client login
- Online users listing and statuses
- Public and private chat
- Adding and removing friends

## Requirements
- Node.js 9.9 and previous
- NPM
- Git

## How to set up Scarlet
Clone Scarlet (correctly)
```
$ git clone http://github.com/tojiru/scarlet
```
afterwards, install the dependencies with npm
```
$ npm install
```
Copy the config and edit it.
```
$ cp config.sample.json config.json && nano config.json
```
finally, run scarlet
```
$ node .
```
To keep Scarlet running, use `screen`
```
$ screen -S scarlet
...
$ node .
```

## About Scarlet
Scarlet aims to emulate the official osu! bancho by sending the same responses that the official bancho does do specific requests

Other bancho implementations such as ruri, delta and pep.py do not do this.

## License
Currently, Scarlet is licensed under MIT. Packages used by Scarlet may be licensed otherwise.

## Credits
itsyuka for creating osu-packet and osu-buffer.
