/*
  EventEmitter
*/
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, cb) {
        if (typeof this.events[event] !== 'object')
            this.events[event] = [];
        this.events[event].push(cb);
    }
    emit(event, data) {
        if (typeof this.events[event] !== 'object')
            return;
        this.events[event].forEach((cb) => cb(data));
    }
}
class Cloudlink {
    constructor(server) {
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
        this.ws.onmessage = (socketdata) => {
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
    send(data) {
        this.ws.send(JSON.stringify(data));
    }
    on(event, cb) {
        this.events.on(event, cb);
    }
    disconnect() {
        this.ws.close();
    }
}
export { EventEmitter, Cloudlink, };
