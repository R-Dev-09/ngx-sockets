import { ManagerOptions, SocketOptions } from 'socket.io-client';

export interface NgxSocketConfig {
  url: string;
  options?: Partial<ManagerOptions> | Partial<SocketOptions>;
}

export type DisconnectReason = 'io server disconnect' | 'io client disconnect' | 'ping timeout' | 'transport close' | 'transport error';
