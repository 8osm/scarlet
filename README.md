# Scarlet
Scarlet is a custom bancho implementation, this handles:
- Client login
- Online users listing and statuses
- Public and private chat

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

## License
Currently, Scarlet is licensed under MIT. Packages used by Scarlet may be licensed otherwise.

## Credits
itsyuka for creating osu-packet and osu-buffer.