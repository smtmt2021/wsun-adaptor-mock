declare module '@serialport/stream' {
  export = SerialPort;
  /**
   * A callback called with an error or null.
   * @typedef {function} errorCallback
   * @param {?error} error
   */
  /**
   * A callback called with an error or an object with the modem line values (cts, dsr, dcd).
   * @typedef {function} modemBitsCallback
   * @param {?error} error
   * @param {?object} status
   * @param {boolean} [status.cts=false]
   * @param {boolean} [status.dsr=false]
   * @param {boolean} [status.dcd=false]
   */
  /**
   * @typedef {Object} openOptions
   * @property {boolean} [autoOpen=true] Automatically opens the port on `nextTick`.
   * @property {number=} [baudRate=9600] The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, or 115200. Custom rates are supported best effort per platform. The device connected to the serial port is not guaranteed to support the requested baud rate, even if the port itself supports that baud rate.
   * @property {number} [dataBits=8] Must be one of these: 8, 7, 6, or 5.
   * @property {number} [highWaterMark=65536] The size of the read and write buffers defaults to 64k.
   * @property {boolean} [lock=true] Prevent other processes from opening the port. Windows does not currently support `false`.
   * @property {number} [stopBits=1] Must be one of these: 1 or 2.
   * @property {string} [parity=none] Must be one of these: 'none', 'even', 'mark', 'odd', 'space'.
   * @property {boolean} [rtscts=false] flow control setting
   * @property {boolean} [xon=false] flow control setting
   * @property {boolean} [xoff=false] flow control setting
   * @property {boolean} [xany=false] flow control setting
   * @property {object=} bindingOptions sets binding-specific options
   * @property {Binding=} binding The hardware access binding. `Bindings` are how Node-Serialport talks to the underlying system. By default we auto detect Windows (`WindowsBinding`), Linux (`LinuxBinding`) and OS X (`DarwinBinding`) and load the appropriate module for your system.
   * @property {number} [bindingOptions.vmin=1] see [`man termios`](http://linux.die.net/man/3/termios) LinuxBinding and DarwinBinding
   * @property {number} [bindingOptions.vtime=0] see [`man termios`](http://linux.die.net/man/3/termios) LinuxBinding and DarwinBinding
   */
  /**
   * Create a new serial port object for the `path`. In the case of invalid arguments or invalid options, when constructing a new SerialPort it will throw an error. The port will open automatically by default, which is the equivalent of calling `port.open(openCallback)` in the next tick. You can disable this by setting the option `autoOpen` to `false`.
   * @class SerialPort
   * @param {string} path - The system path of the serial port you want to open. For example, `/dev/tty.XXX` on Mac/Linux, or `COM1` on Windows.
   * @param {openOptions=} options - Port configuration options
   * @param {errorCallback=} openCallback - Called after a connection is opened. If this is not provided and an error occurs, it will be emitted on the port's `error` event. The callback will NOT be called if `autoOpen` is set to `false` in the `openOptions` as the open will not be performed.
   * @property {number} baudRate The port's baudRate. Use `.update` to change it. Read-only.
   * @property {object} binding The binding object backing the port. Read-only.
   * @property {boolean} isOpen `true` if the port is open, `false` otherwise. Read-only. (`since 5.0.0`)
   * @property {string} path The system path or name of the serial port. Read-only.
   * @throws {TypeError} When given invalid arguments, a `TypeError` will be thrown.
   * @emits open
   * @emits data
   * @emits close
   * @emits error
   * @alias module:serialport
   */
  function SerialPort(path: string, options?: openOptions | undefined, openCallback?: errorCallback | undefined): import("@serialport/stream/lib");
  class SerialPort {
    /**
     * A callback called with an error or null.
     * @typedef {function} errorCallback
     * @param {?error} error
     */
    /**
     * A callback called with an error or an object with the modem line values (cts, dsr, dcd).
     * @typedef {function} modemBitsCallback
     * @param {?error} error
     * @param {?object} status
     * @param {boolean} [status.cts=false]
     * @param {boolean} [status.dsr=false]
     * @param {boolean} [status.dcd=false]
     */
    /**
     * @typedef {Object} openOptions
     * @property {boolean} [autoOpen=true] Automatically opens the port on `nextTick`.
     * @property {number=} [baudRate=9600] The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, or 115200. Custom rates are supported best effort per platform. The device connected to the serial port is not guaranteed to support the requested baud rate, even if the port itself supports that baud rate.
     * @property {number} [dataBits=8] Must be one of these: 8, 7, 6, or 5.
     * @property {number} [highWaterMark=65536] The size of the read and write buffers defaults to 64k.
     * @property {boolean} [lock=true] Prevent other processes from opening the port. Windows does not currently support `false`.
     * @property {number} [stopBits=1] Must be one of these: 1 or 2.
     * @property {string} [parity=none] Must be one of these: 'none', 'even', 'mark', 'odd', 'space'.
     * @property {boolean} [rtscts=false] flow control setting
     * @property {boolean} [xon=false] flow control setting
     * @property {boolean} [xoff=false] flow control setting
     * @property {boolean} [xany=false] flow control setting
     * @property {object=} bindingOptions sets binding-specific options
     * @property {Binding=} binding The hardware access binding. `Bindings` are how Node-Serialport talks to the underlying system. By default we auto detect Windows (`WindowsBinding`), Linux (`LinuxBinding`) and OS X (`DarwinBinding`) and load the appropriate module for your system.
     * @property {number} [bindingOptions.vmin=1] see [`man termios`](http://linux.die.net/man/3/termios) LinuxBinding and DarwinBinding
     * @property {number} [bindingOptions.vtime=0] see [`man termios`](http://linux.die.net/man/3/termios) LinuxBinding and DarwinBinding
     */
    /**
     * Create a new serial port object for the `path`. In the case of invalid arguments or invalid options, when constructing a new SerialPort it will throw an error. The port will open automatically by default, which is the equivalent of calling `port.open(openCallback)` in the next tick. You can disable this by setting the option `autoOpen` to `false`.
     * @class SerialPort
     * @param {string} path - The system path of the serial port you want to open. For example, `/dev/tty.XXX` on Mac/Linux, or `COM1` on Windows.
     * @param {openOptions=} options - Port configuration options
     * @param {errorCallback=} openCallback - Called after a connection is opened. If this is not provided and an error occurs, it will be emitted on the port's `error` event. The callback will NOT be called if `autoOpen` is set to `false` in the `openOptions` as the open will not be performed.
     * @property {number} baudRate The port's baudRate. Use `.update` to change it. Read-only.
     * @property {object} binding The binding object backing the port. Read-only.
     * @property {boolean} isOpen `true` if the port is open, `false` otherwise. Read-only. (`since 5.0.0`)
     * @property {string} path The system path or name of the serial port. Read-only.
     * @throws {TypeError} When given invalid arguments, a `TypeError` will be thrown.
     * @emits open
     * @emits data
     * @emits close
     * @emits error
     * @alias module:serialport
     */
    constructor(path: string, options?: openOptions | undefined, openCallback?: errorCallback | undefined);
    opening: boolean;
    closing: boolean;
    _pool: Buffer;
    _kMinPoolSpace: number;
    _error(error: any, callback: any): void;
    _asyncError(error: any, callback: any): void;
    open(openCallback?: errorCallback | undefined): undefined;
    update(options?: object | undefined, callback?: errorCallback | undefined): undefined;
    write(data: any, encoding: any, callback: any): any;
    _write(data: any, encoding: any, callback: any): any;
    _writev(data: any, callback: any): void;
    _read(bytesToRead: any): void;
    _disconnected(err: any): void;
    close(callback: errorCallback, disconnectError: Error): undefined;
    set(options?: object | undefined, callback?: errorCallback | undefined): undefined;
    get(callback?: modemBitsCallback | undefined): undefined;
    flush(callback?: errorCallback | undefined): undefined;
    drain(callback?: errorCallback | undefined): undefined;
  }
  namespace SerialPort {
    export { list, errorCallback, modemBitsCallback, openOptions };
  }
  type openOptions = {
    /**
     * Automatically opens the port on `nextTick`.
     */
    autoOpen?: boolean;
    /**
     * The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, or 115200. Custom rates are supported best effort per platform. The device connected to the serial port is not guaranteed to support the requested baud rate, even if the port itself supports that baud rate.
     */
    baudRate?: number | undefined;
    /**
     * Must be one of these: 8, 7, 6, or 5.
     */
    dataBits?: number;
    /**
     * The size of the read and write buffers defaults to 64k.
     */
    highWaterMark?: number;
    /**
     * Prevent other processes from opening the port. Windows does not currently support `false`.
     */
    lock?: boolean;
    /**
     * Must be one of these: 1 or 2.
     */
    stopBits?: number;
    /**
     * Must be one of these: 'none', 'even', 'mark', 'odd', 'space'.
     */
    parity?: string;
    /**
     * flow control setting
     */
    rtscts?: boolean;
    /**
     * flow control setting
     */
    xon?: boolean;
    /**
     * flow control setting
     */
    xoff?: boolean;
    /**
     * flow control setting
     */
    xany?: boolean;
    /**
     * sets binding-specific options
     */
    bindingOptions?: object | undefined;
    /**
     * The hardware access binding. `Bindings` are how Node-Serialport talks to the underlying system. By default we auto detect Windows (`WindowsBinding`), Linux (`LinuxBinding`) and OS X (`DarwinBinding`) and load the appropriate module for your system.
     */
    binding?: any;
    /**
     * see [`man termios`](http://linux.die.net/man/3/termios) LinuxBinding and DarwinBinding
     */
    vmin?: number;
    /**
     * see [`man termios`](http://linux.die.net/man/3/termios) LinuxBinding and DarwinBinding
     */
    vtime?: number;
  };
  /**
   * A callback called with an error or null.
   */
  type errorCallback = Function;
  /**
   * A callback called with an error or an object with the modem line values (cts, dsr, dcd).
   */
  type modemBitsCallback = Function;
  namespace list { }
}
