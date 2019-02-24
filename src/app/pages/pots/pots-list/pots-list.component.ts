import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IpcService } from '../../../ipc.service';
import { ListHandler } from '../../../global/listHandler';
import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import * as RxExt from 'rxjs/internal/observable/fromPromise';
import { ConstantPool, Statement, isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-pots-list',
  templateUrl: './pots-list.component.html',
  styleUrls: ['./pots-list.component.scss']
})
export class PotsListComponent implements OnInit {
  public potsList: ListHandler;
  public myTitle = 'Heeey there';
  public myObs$;
  // @ViewChild('search')search: ElementRef;

  constructor(
    private ipc: IpcService,
    private ngZone: NgZone,
  ) { }

  runZone = () => { this.ngZone.run(() => {}); };

  ngOnInit() {
    console.log('onInit');

    this.potsList = new ListHandler({
      rowsPerPage  : 10,
      filterField  : 'name',
      orderFields  : ['pos']
    });

    this.potsList.loadFromObs(this.ipc.callApi('acc_pots:get'), this.runZone);

    // this.ipc.callApi('acc_pots:get').subscribe((resp: any) => {
    //   this.ngZone.run(() => {
    //     console.log('resp.result', resp.result);
    //     this.potsList.load(resp.result);
    //   });
    // });

  }

}
