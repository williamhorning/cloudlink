/*

Cloudlink JS

Copyright © 2021 William Horning

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

// light polyfill for nodejs EventEmitter

window.EventEmitter = class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }

  emit(event, data) {
    let cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach((cb) => cb(data));
    }
  }
};

// Cloudlink JS client

class CloudlinkJS {
  constructor(server) {
    this.events = new window.EventEmitter();
    this.ws = new WebSocket(server);
    this.gvar = {};
    this.pvar = {};
    this.ulist = [];
    this.version = '';
    this.motd = '';
    this.status = '';
    this.ws.onopen = async () => {
      this.send({
        cmd: 'direct',
        val: { cmd: 'ip', val: (await (await fetch('https://api.ipify.org/')).text()) },
      });
      this.send({
        cmd: 'direct',
        val: { cmd: 'type', val: 'js' },
      });
      this.events.emit('wsopened');
    };

    this.ws.onmessage = (e) => {
      var data = JSON.parse(e.data);
      if (data.cmd == 'gmsg') {
        this.events.emit('gmsg', data);
      } else if (data.cmd == 'pmsg') {
        this.events.emit('pmsg', data);
      } else if (data.cmd == 'gvar') {
        this.gvar[data.name] = data.val;
        this.events.emit('gvar');
      } else if (data.cmd == 'pvar') {
        this.pvar[data.name] = data.val;
        this.events.emit('pvar');
      } else if (data.cmd == 'ulist') {
        this.ulist = data.val.split(';');
        this.events.emit('ulist');
      } else if (data.cmd == 'direct') {
        if (data.val.cmd == 'vers') {
          this.version = data.val.val;
          this.events.emit('vers');
        } else if (data.val.cmd == 'motd') {
          this.motd = data.val.val;
          this.events.emit('motd');
        } else {
          this.events.emit('direct', data.val.val);
        }
      } else if (data.cmd == 'statuscode') {
        this.status = data.val;
        this.events.emit('status');
      }
    };

    this.ws.onclose = () => {
      this.events.emit('wsclosed');
    };

    this.ws.onerror = function (e) {
      this.vents.emit('wserror', e);
    };
  }
  send(data) {
    this.ws.send(JSON.stringify(data));
  }
  on(event, cb) {
    return this.events.on(event, cb);
  }
  disconnect() {
    this.ws.close();
  }
}

export default CloudlinkJS;
