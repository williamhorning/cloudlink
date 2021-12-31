# Cloudlink JS

A Javascript client for Cloudlink servers

## Installing

### Node.js

Install the [`cloudlink`](https://www.npmjs.com/package/cloudlink) package and use the following code to import the ESM version of Cloudlink:

```js
import { Cloudlink } from 'cloudlink';
```

### Typescript

Install the [`cloudlink`](https://www.npmjs.com/package/cloudlink) package and use the following code to import the Typescript version of Cloudlink:

```ts
import { Cloudlink } from 'cloudlink/typescript/cloudlink';
```

### Browser

Use the following code to use Cloudlink in the browser:

```html
<script type="module">
  import { Cloudlink } from './path/to/cloudlink.js';
</script>
```

## Usage

### Creating a new Cloudlink instance

```ts
import { Cloudlink } from './path/to/cloudlink.js';
var client = new Cloudlink('ws://localhost:8080');
```

### Listening for events

```ts
client.on('gmsg', (data) => {
  console.log(`Data is: ${JSON.stringify(data)}`);
});
```

### Events

| **Name**     | **Description**          |
| ------------ | ------------------------ |
| gmsg         | Global Message           |
| pmsg         | Private Message          |
| gvar         | Global Variable          |
| pvar         | Private Variable         |
| ulist        | User List                |
| vers         | Server Version           |
| motd         | Message of the Day       |
| direct       | Direct Command           |
| status       | Status Code              |
| connected    | Connected to server      |
| disconnected | Disconnected from server |
| error        | Internal error           |

### Send a command

```ts
client.send({ cmd: 'gmsg', msg: 'Hello World!' });
```

### Disconnect

```ts
client.disconnect();
```

### Accessing a variable

```ts
console.log(client.data.gvar);
```

### Variables

| **Name**    | **Description**    |
| ----------- | ------------------ |
| gvar        | Global Variable    |
| pvar        | Private Variable   |
| ulist       | User List          |
| version     | Server Version     |
| motd        | Message of the Day |
| status      | Status Codes       |
| status.info | Status type        |
| status.code | Status code        |
| status.msg  | Status message     |

## License

See the `LICENSE` file.
