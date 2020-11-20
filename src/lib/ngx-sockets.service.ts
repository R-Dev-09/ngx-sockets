import { Observable, Observer } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { DisconnectReason, NgxSocketConfig } from './ngx-sockets.models';

export class NgxSocket {

  public ioSocket: Socket;
  public subCounter: Record<string, number> = {};
  public events$: Record<string, Observable<any>> = {};

  constructor(public config: NgxSocketConfig) {
    this.ioSocket = io(config?.url ?? '', config?.options ?? {});
  }

  public get id(): string {
    return this.ioSocket.id;
  }

  public get connected(): boolean {
    return this.ioSocket.connected;
  }

  public get disconnected(): boolean {
    return this.ioSocket.disconnected;
  }

  public open(): Socket {
    return this.ioSocket.open();
  }

  public close(): Socket {
    return this.ioSocket.close();
  }

  public connect(): Socket {
    return this.ioSocket.connect();
  }

  public disconnect(): Socket {
    return this.ioSocket.disconnect();
  }

  public send(...args: any[]): Socket {
    return this.ioSocket.send(...args);
  }

  public emit(eventName: string, ...args: any[]): Socket {
    return this.ioSocket.emit(eventName, ...args);
  }

  public on(eventName: string, listener: (...args: any[]) => void): any {
    return this.ioSocket.on(eventName, listener);
  }

  public onAny(listener: (event: string, ...args: any[]) => void): Socket {
    return this.ioSocket.onAny(listener);
  }

  public prependAny(listener: (event: string, ...args: any[]) => void): Socket {
    return this.ioSocket.prependAny(listener);
  }

  public offAny(listener?: (event: string, ...args: any[]) => void): Socket {
    return this.ioSocket.offAny(listener);
  }

  public listenersAny(): ((...args: any[]) => void)[] {
    return this.ioSocket.listenersAny();
  }

  public compress(value: boolean): Socket {
    return this.ioSocket.compress(value);
  }

  public onConnect(listener: (...args: any[]) => void): any {
    return this.ioSocket.on('connect', listener);
  }

  public onDisconnect(listener: (reason: DisconnectReason) => void): any {
    return this.ioSocket.on('disconnect', listener);
  }

  public onConnectError(listener: (error: Error) => void): any {
    return this.ioSocket.on('connect_error', listener);
  }

  public fromEvent<T>(eventName: string): Observable<T> {
    if (!this.subCounter[eventName]) this.subCounter[eventName] = 0;
    this.subCounter[eventName]++;
    if (!this.events$[eventName]) {
      this.events$[eventName] = new Observable<T>((obs: Observer<T>) => {
        const listener = (data: T) => obs.next(data);
        this.ioSocket.on(eventName, listener);
        return () => {
          this.subCounter[eventName]--;
          if (!this.subCounter[eventName]) {
            this.ioSocket.off(eventName, listener);
            delete this.events$[eventName];
          }
        };
      });
    }
    return this.events$[eventName];
  }

  public fromEventOnce<T>(eventName: string): Promise<T> {
    return new Promise<T>(resolve => this.ioSocket.once(eventName, resolve));
  }
}
