class Cloudlink {
    constructor(server) {
        this.events = {};
        console.warn('Cloudlink.js is deprecated. Please use another library. See https://github.com/wgyt/cloudlink#Deprecation');
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
        this.ws.onmessage = (socketdata) => {
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
    send(data) {
        this.ws.send(JSON.stringify(data));
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
    disconnect() {
        this.ws.close();
    }
}
export default Cloudlink;
