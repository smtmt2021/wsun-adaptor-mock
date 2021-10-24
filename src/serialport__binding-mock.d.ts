declare module '@serialport/binding-mock' {
  /**
   * Mock bindings for pretend serialport access
   */
  class MockBinding {
    static reset(): void;
    static createPort(path: any, opt: any): void;
    static list(): Promise<any>;
    constructor(opt?: {});
    pendingRead: (err: any) => void;
    isOpen: boolean;
    port: any;
    lastWrite: Buffer;
    recording: Buffer;
    writeOperation: any;
    emitData(data: any): void;
    open(path: any, opt: any): Promise<void>;
    serialNumber: any;
    close(): Promise<void>;
    read(buffer: any, offset: any, length: any): Promise<any>;
    write(buffer: any): Promise<any>;
    update(opt: any): Promise<void>;
    set(opt: any): Promise<void>;
    get(): Promise<{
      cts: boolean;
      dsr: boolean;
      dcd: boolean;
    }>;
    getBaudRate(): Promise<{
      baudRate: any;
    }>;
    flush(): Promise<void>;
    drain(): Promise<void>;
  }
  export = MockBinding;
}
