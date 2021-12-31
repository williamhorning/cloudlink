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

declare class EventEmitter {
  events: eventsObj;
  constructor();
  on(event: string, cb: callback): void;
  emit(event: string, data?: any): void;
}

declare class Cloudlink {
  events: EventEmitter;
  ws: WebSocket;
  data: cloudlinkData;
  constructor(server: string);
  send(data: outgoingPacket): void;
  on(event: string, cb: callback): void;
  disconnect(): void;
}

export {
    callback,
    eventsObj,
    outgoingPacket,
    looseObj,
    cloudlinkData,
    EventEmitter,
    Cloudlink
}