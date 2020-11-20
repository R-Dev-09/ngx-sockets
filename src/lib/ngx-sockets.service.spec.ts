import { TestBed } from '@angular/core/testing';

import { NgxSocket } from './ngx-sockets.service';

describe('NgxSocketsService', () => {
  let service: NgxSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
