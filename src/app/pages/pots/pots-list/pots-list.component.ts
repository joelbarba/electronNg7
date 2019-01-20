import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IpcService } from '../../../ipc.service';
// import { FormsModule } from '@angular/forms';
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
  public myTitle = 'Heeey there';
  public myObs$;
  public accPots = {
    loadedList: [],
    renderedList: [],

    filterText: '',
    filterField: 'name',
    orderField: '',
    orderReverse: false,
    rowsPerPage: 15,
    currentPage: 1,
    totalPages: 1,

    setOrder: new Rx.Subject(),
    setFilter: new Rx.Subject(),
    setPage: new Rx.Subject(),
    setContent: new Rx.Subject()
  };


  constructor(private readonly ipc: IpcService, private ngZone: NgZone) { }

  @ViewChild('search')search: ElementRef;


  ngOnInit() {
    console.log('onInit');


    this.ipc.callApi('acc_pots:get').subscribe((resp: any) => {
      // this.ngZone.run(() => {
        console.log('resp.result', resp.result);
        this.accPots.setContent.next(resp.result);
      // });
    });

    // List content
    const iniContent = { loadedList: [] };
    const contentObs = this.accPots.setContent.pipe(
      RxOp.map((loadedList) => ({ loadedList })),
      RxOp.tap(() => console.log('Changing content')),
    );

    // List order
    const iniOrder = { orderField: '', orderReverse: false };
    const orderObs = this.accPots.setOrder.pipe(
      RxOp.scan((state, field: string) => {
        if (state.orderField !== field) {
          state.orderField = field;
          state.orderReverse = false;
        } else {
          state.orderReverse = !state.orderReverse;
        }
        return state;
      }, iniOrder),
      RxOp.tap(() => console.log('Changing Order')),
    );

    // List filter
    const iniFilter = { filterText: '', filterField: 'name' };
    const filterObs = this.accPots.setFilter.pipe(
      RxOp.debounceTime(200),
      RxOp.map((filterText) => ({ filterText })),
      RxOp.tap(() => console.log('Changing Filter'))
    );

    // List Pagination
    const iniPagination = { rowsPerPage: 5, currentPage: 1 };
    const pageObs = this.accPots.setPage.pipe(
      RxOp.scan((state, increment: number) => {
        state.currentPage += increment;
        if (state.currentPage < 1) { state.currentPage = 1; }
        return state;
      }, iniPagination),
      RxOp.tap(() => console.log('Changing Page'))
    );


    // List Render
    const initState = { ...iniContent, ...iniOrder, ...iniFilter, ...iniPagination };
    Rx.merge(orderObs, filterObs, contentObs, pageObs).pipe(
      RxOp.scan((state, newValues) => {
        return {...state, ...newValues};
      }, initState ),
    ).subscribe((state: any) => {
      console.log('render the list', state);

      let renderedList = state.loadedList;

      // Filter list
      if (!!state.filterText && !!state.filterField) {
        renderedList = renderedList.filter((item) => {
          return item.name.toLowerCase().indexOf(state.filterText.toLowerCase()) >= 0;
        });
      }

      // Order list
      if (!!state.orderField) {
        renderedList = renderedList.sort((itemA, itemB) => {
          const reVal = !!state.orderReverse ? -1 : 1;
          return (itemA[state.orderField] > itemB[state.orderField] ? reVal : -reVal);
        });
      }

      // Truncate pagination
      if (!!state.currentPage && !!state.rowsPerPage) {
        state.totalPages = Math.ceil(renderedList.length / state.rowsPerPage);
        if (state.currentPage > state.totalPages) {
          state.currentPage = state.totalPages;
        }
        renderedList = renderedList.filter((item, ind) => {
          const offSet = (state.currentPage - 1) * state.rowsPerPage;
          const limit = state.currentPage * state.rowsPerPage;
          return (ind >= offSet && ind < limit);
        });
      }

      this.accPots = { ...this.accPots, ...state, renderedList };
    });




  }

}
