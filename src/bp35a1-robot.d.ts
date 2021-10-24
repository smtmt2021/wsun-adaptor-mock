/// <reference types="node" />
import MockBinding = require('@serialport/binding-mock');
export { MockBinding };
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
export declare class Bp35a1Robot extends MockBinding {
    private static _instance;
    static get instance(): Bp35a1Robot;
    panDescriptor: WsunPanDesc;
    reg: {
        S02: number;
        S03: number;
        S07: number;
        S0A: string;
        S15: number;
        S16: number;
        S17: number;
        SA0: number;
        SA1: number;
        SFB: number;
        SFD: number;
        SFE: number;
        SFF: number;
    };
    ipv6: string;
    ports: number[];
    ports2: number[];
    opt: number;
    rbid: string;
    password: string;
    udps: UDP[];
    lookupTable: {
        [name: string]: string;
    };
    noCommandReply: boolean;
    noScanReply: boolean;
    noScanDevice: boolean;
    noJoinReply: boolean;
    noLookupReply: boolean;
    noOkParam: boolean;
    failJoin: boolean;
    noTermReply: boolean;
    termReplyEvent28: boolean;
    termFailEr10: boolean;
    udpRetryCount: number;
    private skreg;
    private getPortTables;
    private sktable;
    private ropt;
    private wopt;
    private sksetrbid;
    private sksetpwd;
    private scan;
    private lookup;
    private skaddnbr;
    private join;
    private term;
    private sendto;
    private parseCommand;
    private reply;
    constructor(options: BindingOptions);
    write(data: Buffer): Promise<void>;
    issueEvent(en: number, param?: number): string;
    sendBack(dest: string, rport: number, lport: number, data: Buffer): void;
}
