/**
 * @license MIT License
 * @copyright KINOSHITA minoru, All Rights Reserved.
 */
import DEBUG from 'debug';
import MockBinding = require('@serialport/binding-mock');
export { MockBinding };
const debug = DEBUG('wsun/robot');

const isMac = /^[0-9A-Fa-f]{16}$/;
const isIPv6 = /^[0-9A-F]+:[0-9A-F]+:[0-9A-F]+:[0-9A-F]+:[0-9A-F]+:[0-9A-F]+:[0-9A-F]+:[0-9A-F]+$/;

function num2hex(n: number, bytes = 2): string {
  if (n > Number.MAX_SAFE_INTEGER) {
    throw new Error(`the specified number is too large, ${n}`);
  }
  if (bytes < 1 || bytes > 8) {
    throw new TypeError(`invalid size of bytes, $${bytes}`);
  }
  return n
    .toString(16)
    .toUpperCase()
    .padStart(bytes * 2, '0');
}

function resolveNextTick(): Promise<void> {
  return new Promise(resolve => process.nextTick(() => resolve()));
}

function sleep(msec: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, msec));
}

interface WsunPanDesc {
  channel: number;
  panId: number;
  addr: string;
  page: number;
  pairId: string;
  LQI: number;
}

interface BindingOptions {
  vmin?: number;
  vtime?: number;
}

interface UDP {
  handle: number;
  ipaddr: string;
  port: number;
  security: number;
  datalen: number;
  data: Buffer;
}

class Cudp implements UDP {
  handle: number;
  ipaddr: string;
  port: number;
  security: number;
  datalen: number;
  data: Buffer;

  constructor(args: string[]) {
    if (args.length !== 6) throw new Error('FAIL ER05');
    this.handle = parseInt(args[0], 16);
    this.ipaddr = args[1];
    this.port = parseInt(args[2], 16);
    this.security = parseInt(args[3], 16);
    this.datalen = parseInt(args[4], 16);
    this.data = Buffer.from(args[5], 'hex');
    if (this.datalen !== this.data.length) throw new Error('FAIL ER06');
  }
}

export class Bp35a1Robot extends MockBinding {
  private static _instance: Bp35a1Robot;
  static get instance(): Bp35a1Robot {
    if (!Bp35a1Robot._instance) throw new Error('no instance');
    return Bp35a1Robot._instance;
  }

  panDescriptor: WsunPanDesc = {
    channel: 0x23,
    page: 0,
    panId: 0xfedc,
    addr: '0123456789ABCDEF',
    LQI: 0,
    pairId: 'CCDDEEFF'
  };

  reg = {
    S02: 0x21,
    S03: 0xffff,
    S07: 0x00000000,
    S0A: 'CCDDEEFF',
    S15: 0,
    S16: 900,
    S17: 1,
    SA0: 1,
    SA1: 1,
    SFB: 0,
    SFD: 0,
    SFE: 1,
    SFF: 0
  };

  ipv6 = '0000:0000:0000:0000:0000:0000:0000:0000';
  ports = [3610, 716, 0, 0, 0, 0];
  ports2 = [716, 0, 0, 0];
  opt = 0;
  rbid = '';
  password = '';
  udps: UDP[] = [];
  lookupTable: { [name: string]: string } = {};
  noCommandReply = false;
  noScanReply = false;
  noScanDevice = false;
  noJoinReply = false;
  noLookupReply = false;
  noOkParam = false;
  failJoin = false;
  noTermReply = false;
  termReplyEvent28 = false;
  termFailEr10 = false;
  udpRetryCount = 0;

  private skreg(args: string[]): string | string[] {
    debug('skreg', args);
    if (args.length < 1 || args.length > 2) return 'FAIL ER05';
    switch (args.shift()) {
      case 'S2':
      case 'S02':
        if (args.length === 1) {
          const param = parseInt(args[0], 16);
          if (param < 0x21 || param > 0x3c) return 'FAIL ER06';
          this.reg.S02 = param;
          return 'OK';
        } else return [`ESREG ${num2hex(this.reg.S02, 1)}`, 'OK'];
      case 'S3':
      case 'S03':
        if (args.length === 1) {
          const param = parseInt(args[0], 16);
          if (param > 0xffff) return 'FAIL ER06';
          this.reg.S03 = param;
          return 'OK';
        } else return [`ESREG ${num2hex(this.reg.S03, 2)}`, 'OK'];
      case 'SFE':
        if (args.length === 1) {
          const param = parseInt(args[0]);
          if (param < 0 || param > 1) return 'FAIL ER06';
          this.reg.SFE = param;
          // this.port.echo = !!param;
          return 'OK';
        } else return [`ESREG ${this.reg.SFE}`, 'OK'];
      default:
        return 'FAIL ER06';
    }
  }

  private getPortTables(): string[] {
    const table = ['EPORT'];
    this.ports.forEach(n => table.push(n.toString()));
    table.push('');
    this.ports2.forEach(n => table.push(n.toString()));
    table.push('OK');
    return table;
  }

  private sktable(args: string[]): string | string[] {
    debug('sktable', args);
    if (args.length !== 1) return 'FAIL ER05';

    const param = parseInt(args[0], 16);
    switch (param) {
      // case 1:
      // case 2:
      case 0xe:
        return this.getPortTables();
      default:
        return 'FAIL ER06';
    }
  }

  private ropt(args: string[]): string | string[] {
    debug('ropt', args);
    if (args.length !== 0) return 'FAIL ER05';
    return this.noOkParam ? 'OK' : `OK ${this.opt ? '1' : '0'}`;
  }

  private wopt(args: string[]): string | string[] {
    debug('wopt', args);
    if (args.length !== 1) return 'FAIL ER05';
    const n = parseInt(args[0]);
    if (n !== 0 && n !== 1) return 'FAIL ER06';
    this.opt = n;
    return 'OK';
  }

  private sksetrbid(args: string[]): string {
    debug('sksetrbid', args);
    if (args.length !== 1) return 'FAIL ER05';
    this.rbid = args[0];
    this.panDescriptor.pairId = args[0].slice(-8);
    return 'OK';
  }

  private sksetpwd(args: string[]): string {
    debug('sksetpwd', args);
    if (args.length !== 2) return 'FAIL ER05';
    const len = parseInt(args[0], 16);
    if (len !== args[1].length) return 'FAIL ER06';
    this.password = args[1];
    return 'OK';
  }

  private scan(args: string[]): string | string[] {
    if (args.length !== 3) return 'FAIL ER05';
    const mode = parseInt(args[0], 16);
    const mask = parseInt(args[1], 16);
    const duration = parseInt(args[2], 16);
    if (mode !== 0 && mode !== 2 && mode !== 3) return 'FAIL ER06';
    if (mask > 0xffffffff) return 'FAIL ER06';
    if (duration > 14) return 'FAIL ER06';
    const response = ['OK'];
    if (!this.noScanDevice) {
      response.push(`EVENT 20 ${this.ipv6}`);
      response.push('EPANDESC');
      response.push(`  Channel:${num2hex(this.panDescriptor.channel, 1)}`);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      response.push(`  Channel Page:${num2hex(this.panDescriptor.page!, 1)}`);
      response.push(`  Pan ID:${num2hex(this.panDescriptor.panId, 2)}`);
      response.push(`  Addr:${this.panDescriptor.addr}`);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      response.push(`  LQI:${num2hex(this.panDescriptor.LQI!, 1)}`);
      response.push(`  PairID:${this.panDescriptor.pairId}`);
    }
    if (!this.noScanReply) {
      response.push(`EVENT 22 ${this.ipv6}`);
    }
    return response;
  }

  private lookup(args: string[]): string | undefined {
    if (args.length !== 1) return 'FAIL ER05';
    if (!isMac.test(args[0])) return 'FAIL ER06';
    if (this.noLookupReply) return;
    const ip0 = this.lookupTable[args[0]];
    if (ip0) return ip0;
    const ip1 = Buffer.from('0000000000000000' + args[0], 'hex');
    const ip2 = Buffer.from('FE800000000000000200000000000000', 'hex');
    const ip3 = Buffer.alloc(16);
    for (let i = 0; i < 16; ++i) ip3[i] = ip1[i] ^ ip2[i];
    return (
      num2hex(ip3.readUInt16BE(0), 2) +
      ':' +
      num2hex(ip3.readUInt16BE(2), 2) +
      ':' +
      num2hex(ip3.readUInt16BE(4), 2) +
      ':' +
      num2hex(ip3.readUInt16BE(6), 2) +
      ':' +
      num2hex(ip3.readUInt16BE(8), 2) +
      ':' +
      num2hex(ip3.readUInt16BE(10), 2) +
      ':' +
      num2hex(ip3.readUInt16BE(12), 2) +
      ':' +
      num2hex(ip3.readUInt16BE(14), 2)
    );
  }

  private skaddnbr(args: string[]): string | undefined {
    if (args.length !== 2) return 'FAIL ER05';
    if (!isIPv6.test(args[0])) return 'FAIL ER06';
    if (!isMac.test(args[1])) return 'FAIL ER06';
    this.lookupTable[args[1]] = args[0];
    return 'OK';
  }

  private join(args: string[]): string | string[] {
    if (args.length !== 1) return 'FAIL ER05';
    if (!isIPv6.test(args[0])) return 'FAIL ER06';
    const response = ['OK'];
    if (this.noJoinReply) return response;
    if (this.failJoin) response.push(`EVENT 24 ${this.ipv6}`);
    else response.push(`EVENT 25 ${this.ipv6}`);
    return response;
  }

  private term(args: string[]): string | string[] {
    if (args.length !== 0) return 'FAIL ER05';
    if (this.termFailEr10) return 'FAIL ER10';
    const response = ['OK'];
    if (this.noTermReply) return response;
    if (this.termReplyEvent28) response.push(`EVENT 28 ${this.ipv6}`);
    else response.push(`EVENT 27 ${this.ipv6}`);
    return response;
  }

  private sendto(args: string[]): string[] | undefined {
    try {
      const udp = new Cudp(args);
      if (udp.ipaddr !== this.ipv6) {
        debug(`sendto: a patcket to ${udp.ipaddr} is ignored`);
        return;
      }
      let reason: number;
      if (this.udpRetryCount > 0) {
        debug('sendto: retry', this.udpRetryCount);
        this.udpRetryCount -= 1;
        reason = 1;
      } else {
        this.udps.push(new Cudp(args));
        reason = 0;
      }
      const response: string[] = [];
      response.push(`EVENT 21 ${this.ipv6} ${reason}`);
      response.push('OK');
      return response;
    } catch (e) {
      console.error('unexpected error:', e);
      throw e;
    }
  }

  private parseCommand(data: Buffer): string | string[] | undefined {
    const line = data.toString().replace(/[\r\n]+$/, '');
    const args = line.split(' ');
    if (args.length === 0) return;
    switch (args.shift()) {
      case 'SKSREG':
        return this.skreg(args);
      case 'ROPT':
        return this.ropt(args);
      case 'WOPT':
        return this.wopt(args);
      case 'SKTABLE':
        return this.sktable(args);
      case 'SKSETRBID':
        return this.sksetrbid(args);
      case 'SKSETPWD':
        return this.sksetpwd(args);
      case 'SKSCAN':
        return this.scan(args);
      case 'SKLL64':
        return this.lookup(args);
      case 'SKADDNBR':
        return this.skaddnbr(args);
      case 'SKJOIN':
        return this.join(args);
      case 'SKSENDTO':
        return this.sendto(args);
      case 'SKTERM':
        return this.term(args);
      default:
        debug('no such command', line.split(' ')[0]);
    }
  }

  private async reply(data: Buffer): Promise<void> {
    if (this.noCommandReply) return Promise.resolve();
    const response = this.parseCommand(data);
    if (!response) return Promise.resolve();
    const responses = response.constructor === Array ? response : [response];
    for (const resp of responses) {
      await sleep(1);
      if (this.isOpen) {
        setTimeout(() => {
          this.emitData(resp + '\r\n');
        }, 100);
      }
    }
    return Promise.resolve();
  }

  constructor(options: BindingOptions) {
    super(options);
    Bp35a1Robot._instance = this;
  }

  write(data: Buffer): Promise<void> {
    debug('writing', data.toString());
    return super
      .write(data)
      .then(resolveNextTick)
      .then(() => this.reply(data));
  }

  issueEvent(en: number, param?: number): string {
    let event = `EVENT ${num2hex(en, 1)} ${this.ipv6}`;
    if (param != null) event += ` ${param}`;
    event += '\r\n';
    this.emitData(event);
    return event;
  }

  sendBack(dest: string, rport: number, lport: number, data: Buffer): void {
    let udp = 'ERXUDP';
    udp += ` ${this.ipv6}`;
    udp += ` ${dest}`;
    udp += ` ${num2hex(rport)}`;
    udp += ` ${num2hex(lport)}`;
    udp += ` ${this.panDescriptor.addr}`;
    udp += ' 2';
    udp += ` ${num2hex(data.length)}`;
    udp += ` ${data.toString('hex')}`;
    udp += '\r\n';
    this.emitData(udp);
    debug(`send back: ${udp.toString()}`);
  }
}
