import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IpcService {
  private _ipc: IpcRenderer | undefined;

  constructor() {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) { throw e; }
    } else { console.warn('Electron\'s IPC was not loaded'); }
  }

  public sendSync = (channel: string, ...args): void => {
    if (!!this._ipc) { return this._ipc.sendSync(channel, ...args); }
  };

  public send = (channel: string, ...args): void => {
    if (!!this._ipc) { this._ipc.send(channel, ...args); }
  };

  public on = (channel: string, listener: any): void => {
    if (!!this._ipc) { this._ipc.on(channel, listener); }
  };

  // Returns an observable to wait until the request is finished
  // The request event is the same + :response
  public callApi = (channel: string, ...args) => {
    const requestSubject = new BehaviorSubject({ status: 0, content: []});
    if (!!this._ipc) {
      this._ipc.send(channel, ...args);
      this._ipc.once(channel + ':response', (event, response) => {
        requestSubject.next({ status: 2, content: response.result});
        requestSubject.complete();
      });
    } else {
      requestSubject.error('no ipc');
    }
    return requestSubject;
  }
}
