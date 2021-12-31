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

type cloudlinkData = {
  gvar: looseObj;
  pvar: looseObj;
  ulist: Array<string>;
  version: string;
  motd: string;
  status: {
    info: boolean;
    code: number;
    msg: string;
  };
};
/*
  EventEmitter
*/
class EventEmitter {
  events: eventsObj = {};

  constructor() {}

  on(event: string, cb: callback) {
    if (typeof this.events[event] !== 'object') this.events[event] = [];
    this.events[event].push(cb);
  }
  emit(event: string, data?: any) {
    if (typeof this.events[event] !== 'object') return;

    this.events[event].forEach((cb) => cb(data));
  }
}

class Cloudlink {
  events: EventEmitter;
  ws: WebSocket;
  data: cloudlinkData;
  constructor(server: string) {
    this.events = new EventEmitter();
    this.ws = new WebSocket(server);
    this.data = {
      gvar: {},
      pvar: {},
      ulist: [],
      version: '0.0.0',
      motd: '',
      status: {
        info: false,
        code: 0,
        msg: '',
      },
    };
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
      this.events.emit('connected');
    };

    this.ws.onmessage = (socketdata: MessageEvent<any>) => {
      var data = JSON.parse(socketdata.data);
      switch (data.cmd) {
        case 'gmsg':
          this.events.emit('gmsg', data);
        case 'pmsg':
          this.events.emit('pmsg', data);
        case 'gvar':
          this.data.gvar[data.name] = data.val;
          this.events.emit('gvar', data);
        case 'pvar':
          this.data.pvar[data.name] = data.val;
          this.events.emit('pvar', data);
        case 'ulist':
          this.data.ulist = data.val.split(';');
          this.events.emit('ulist', this.data.ulist);
        case 'direct':
          switch (data.val.cmd) {
            case 'vers':
              this.data.version = data.val.val;
              this.events.emit('version', this.data.version);
            case 'motd':
              this.data.motd = data.val.val;
              this.events.emit('motd', this.data.motd);
            default:
              this.events.emit('direct', data);
          }
        case 'statuscode':
          let regx = /([IE]):(\d\d\d) \| (.*)/g;
          let match = data.val.match(regx);
          this.data.status = {
            info: match[1] === 'I',
            code: match[2],
            msg: match[3],
          };
          this.events.emit('statuscode', this.data.status);
        default:
          this.events.emit('error', new Error('Unknown command: ' + data.cmd));
      }
    };

    this.ws.onclose = () => {
      this.events.emit('disconnected');
    };

    this.ws.onerror = (e) => {
      this.events.emit('error', e);
    };
  }
  send(data: outgoingPacket) {
    this.ws.send(JSON.stringify(data));
  }
  on(event: string, cb: callback) {
    this.events.on(event, cb);
  }
  disconnect() {
    this.ws.close();
  }
}

export {
  callback,
  eventsObj,
  outgoingPacket,
  looseObj,
  cloudlinkData,
  EventEmitter,
  Cloudlink,
};
