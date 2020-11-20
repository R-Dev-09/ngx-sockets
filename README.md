# ngx-sockets

[Socket.IO](https://socket.io/) module for Angular 10+ with socket.io v3+

## Install
``` npm install ngx-sockets ```

## How to use

### Import and configure NgxSocketsModule

```ts
import { NgxSocketsModule, NgxSocketConfig } from 'ngx-sockets';

const config: NgxSocketConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxSocketsModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

We need to configure ```NgxSocketsModule``` module using the object ```config``` of type ```NgxSocketConfig```, this object accepts two optional properties they are the same used here [io([url][, options])](https://socket.io/docs/v3/client-api/#io-url-options).

Now we pass the configuration to the static method ```forRoot``` of ```NgxSocketsModule```


### Using your socket Instance

The ```NgxSocketsModule``` provides now a configured ```NgxSocket``` service that can be injected anywhere inside the ```AppModule```.

```typescript

import { Injectable } from '@angular/core';
import { NgxSocket } from 'ngx-sockets';
import { map } from 'rxjs/operators';

@Injectable()
export class ChatService {

  constructor(private socket: NgxSocket) {}

  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }

  getMessage(): Observable<any> {
    return this.socket.fromEvent<any>('message').pipe(map((data: any) => data.msg));
  }
}

```

### Using multiple sockets with different end points

In this case we do not configure the ```NgxSocketsModule``` directly using ```forRoot```. What we have to do is: extend the ```NgxSocket``` service, and call ```super()``` with the ```NgxSocketConfig``` object type (passing ```url``` & ```options``` if any).

```typescript

import { Injectable, NgModule } from '@angular/core';
import { NgxSocket } from 'ngx-sockets';

@Injectable()
export class SocketOne extends NgxSocket {

  constructor() {
    super({ url: 'http://url_one:portOne', options: {} });
  }
}

@Injectable()
export class SocketTwo extends NgxSocket {

  constructor() {
    super({ url: 'http://url_two:portTwo', options: {} });
  }
}

@NgModule({
  declarations: [
    //components
  ],
  imports: [
    NgxSocketsModule,
    //...
  ],
  providers: [SocketOne, SocketTwo],
  bootstrap: [/** AppComponent **/]
})
export class AppModule { }

```

Now you can inject ```SocketOne```, ```SocketTwo``` in any other services and / or components.


## API

The properties and methods exposed by `NgxSocket` are the same as exposed by the socket.io [client API](https://socket.io/docs/v3/client-api/), with some small additions.

### `socket.id`

A `string` with the id of the underlying socket.

### `socket.connected`

A `boolean`, representing whether or not the socket is connected to the server.

### `socket.disconnected`

A `boolean`, representing whether or not the socket is disconnected from the server.

### `socket.open(): Socket`

Manually opens the socket.
Same as `socket.connect()`.

### `socket.close(): Socket`

Manually closes the socket.
Same as `socket.disconnect()`.

### `socket.connect(): Socket`

Manually connects the socket.
Same as `socket.open()`.

### `socket.disconnect(): Socket`

Manually disconnects the socket.
Same as `socket.close()`.

### `socket.send(...args: any[]): Socket`

Sends a `message` event with the provided arguments.
See `socket.emit()`.

### `socket.emit(eventName: string, ...args: any[]): Socket`

Emits an event with the provided `eventName` to the corresponding listener on the server.
Any other arguments can be provided.

### `socket.on(eventName: string, listener: (...args: any[]) => void): Emitter`

Registers a listener to the event with the provided `eventName`.

### `socket.onAny(listener: (event: string, ...args: any[]) => void): Socket`

Registers a new catch-all listener.

### `socket.prependAny(listener: (event: string, ...args: any[]) => void): Socket`

Same as `socket.onAny()`, but adds the listener to the beginning of the listeners array.

### `socket.offAny(listener?: (event: string, ...args: any[]) => void): Socket`

Removes the previously registered listener.
If no listener is provided, all catch-all listeners are removed.

### `socket.listenersAny(): ((...args: any[]) => void)[]`

Returns the list of registered catch-all listeners.

### `socket.compress(value: boolean): Socket`

Sets a modifier for the subsequent event, whether or not to compress the event data.
Defaults to `true` if not set.

### `socket.onConnect(listener: (...args: any[]) => void): Emitter`

Registers the provided listener for the `connect` event.

### `socket.onDisconnect(listener: (reason: DisconnectReason) => void): Emitter`

Registers the provided listener for the `disconnect` event.

### `socket.onConnectError(listener: (error: Error) => void): Emitter`

Registers the provided listener for the `connect_error` event.

### `socket.fromEvent<T>(eventName: string): Observable<T>`

Returns an observable which can be used to listen to the event with the provided `eventName`.
This method is most commonly used in an Angular application with the rxjs library.
Don't forget to `unsubscribe()` to prevent memory leaks.

### `socket.fromEventOnce<T>(eventName: string): Promise<T>`

Returns a promise to listen for a one-time event.

## Related projects

- [bougarfaoui/ng-socket-io](https://github.com/bougarfaoui/ng-socket-io) - Socket.IO module for Angular
- [rodgc/ngx-socket-io](https://github.com/rodgc/ngx-socket-io) - Socket.IO module for Angular

## LICENSE

MIT
