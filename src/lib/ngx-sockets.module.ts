import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { NgxSocketConfig } from './ngx-sockets.models';
import { NgxSocket } from './ngx-sockets.service';

export function NgxSocketFactory(config: NgxSocketConfig): NgxSocket {
  return new NgxSocket(config);
};
export const NGX_SOCKET_CONFIG_TOKEN = new InjectionToken<NgxSocketConfig>('__NGX_SOCKET_CONFIG__');

@NgModule({})
export class NgxSocketsModule {
  static forRoot(config: NgxSocketConfig): ModuleWithProviders<NgxSocketsModule> {
    return {
      ngModule: NgxSocketsModule,
      providers: [
        {provide: NGX_SOCKET_CONFIG_TOKEN, useValue: config},
        {provide: NgxSocket, useFactory: NgxSocketFactory, deps: [NGX_SOCKET_CONFIG_TOKEN]}
      ]
    };
  }
}
