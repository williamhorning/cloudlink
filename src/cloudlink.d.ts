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

declare class Cloudlink {
  events: eventsObj;
  ws: WebSocket;
  constructor(server: string);
  send(data: outgoingPacket): void;
  on(event: string, cb: callback): void;
  emit(event: string, data?: any): void;
  disconnect(): void;
}

export { callback, eventsObj, outgoingPacket, looseObj, Cloudlink };
