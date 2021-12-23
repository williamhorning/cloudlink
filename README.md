# Cloudlink JS

A Javascript client for Cloudlink servers

## How to install

Download `cljs.js` and import it into your project.

### Browser Environments

To use Cloudlink JS in a browser, add the attrribute `type="module"` to the script tag and use the following to import it

```js
import CloudlinkJS from './cljs.js';
```

### Node.js

To use Cloudlink JS in Node.js, add `"type": "module"` to `package.json` and use the following to import it

```js
import CloudlinkJS from './cljs.js';
```

## Code Snippets

### Initialize

```js
import CloudlinkJS from './cljs.js';
var cljs = new CloudlinkJS('wss://server.meower.org');
```

### Listen for events

```js
cljs.on('gmsg', (message) => {
  console.log(message);
});
```

#### Event types

| **Name** | **Description**    |
| -------- | ------------------ |
| gmsg     | Global Message     |
| pmsg     | Private Message    |
| gvar     | Global Variable    |
| pvar     | Private Variable   |
| ulist    | User List          |
| vers     | Version            |
| motd     | Message of the Day |
| direct   | Direct Command     |
| status   | Status Code        |
| wsopened | WebSocket Opened   |
| wsclosed | WebSocket Closed   |
| wserror  | WebSocket Error    |

### Send a command

```js
cljs.send({ cmd: 'gmsg', msg: 'Hello World!' });
```

### Disconnect

```js
cljs.disconnect();
```

### Variables

```js
// gvar
console.log(cljs.gvar); // {name:'this is the name variable'}
// pvar
console.log(cljs.pvar); // {name:'this is the name variable'}
// ulist
console.log(cljs.ulist); // ['person1']
// version
console.log(cljs.version); // '1.0.0'
// motd
console.log(cljs.motd); // 'This is the MOTD'
// status
console.log(cljs.status); // 'I:100:OK:The server handed the request correctly.'
```

## License
See the `LICENSE` file.