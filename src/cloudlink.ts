/*
  Typescript Types
*/
type callback = (data: any[]) => any;

type eventsObj = { [event: string]: callback[] };

type outgoingPacket =
  | {
      cmd: string;
      val: any;
    }
  | {
      cmd: string;
      val: any;
      id: string;
    }
  | {
      cmd: string;
      val: any;
      name: string;
    }
  | {
      cmd: string;
      val: any;
      name: string;
      id: string;
    };
interface looseObj {
  [key: string]: any;
}

class Cloudlink {
  events: eventsObj = {};
  ws: WebSocket;
  constructor(server: string) {
    console.warn(
      'Cloudlink.js is deprecated. Please use another library. See https://github.com/wgyt/cloudlink#Deprecation'
    );
    this.ws = new WebSocket(server);
    this.ws.onopen = async () => {
      this.send({
        cmd: 'direct',
        val: {
          cmd: 'ip',
          val: await (await fetch('https://api.ipify.org/')).text(),
        },
      });
      this.send({
        cmd: 'direct',
        val: { cmd: 'type', val: 'js' },
      });
      this.emit('connected');
    };

    this.ws.onmessage = (socketdata: MessageEvent<any>) => {
      var data = JSON.parse(socketdata.data);
      this.emit(data.cmd, data);
    };

    this.ws.onclose = () => {
      this.emit('disconnected');
    };

    this.ws.onerror = (e) => {
      this.emit('error', e);
    };
  }
  send(data: outgoingPacket) {
    this.ws.send(JSON.stringify(data));
  }
  on(event: string, cb: callback) {
    if (typeof this.events[event] !== 'object') this.events[event] = [];
    this.events[event].push(cb);
  }
  emit(event: string, data?: any) {
    if (typeof this.events[event] !== 'object') return;

    this.events[event].forEach((cb) => cb(data));
  }

  disconnect() {
    this.ws.close();
  }
}

export { callback, eventsObj, outgoingPacket, looseObj };

export default Cloudlink;
