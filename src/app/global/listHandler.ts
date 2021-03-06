import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';
import * as RxExt from 'rxjs/internal/observable/fromPromise';

/****************************************************************
 - To create a new instance (all params are optionals):

  this.myList = new ListHandler({
    filterText   : '',
    filterFields : ['name'],
    orderFields  : ['pos','amount'],
    orderReverse : false,
    rowsPerPage  : 15,
    currentPage  : 1,
    totalPages   : 1
  });

******************************************************************/

export class ListHandler {
  private setContent;  // Subject to trigger a list content change -----> load()
  private setFilter  = new Rx.Subject();  // Subject to trigger a list filter change ------> filter()
  private setOrder   = new Rx.Subject();  // Subject to trigger a list reorder change -----> order()
  private setPage    = new Rx.Subject();  // Subject to trigger a list pagination change --> paginate() / nextPate() / prevPage ()

  public render$: Rx.Observable<any>;     // Observable to listen to rendering changes
  public renderList$: Rx.Observable<any>; // Observable to listen to rendering changes, mapping only renderedList as output
  public loadingPromise;                  // Promise to wait while loading the list
  public loadingStatus : number = 0;      // 0=Empty, 1=Loading, 2=Loaded, 3=Error

  public loadedList: Array<any>;    // Array with the full loaded content
  public renderedList: Array<any>;  // Array with the content to render on the list (filtered + ordered + paginated)

  public filterText: String;          // Text of the filter (only matches will pass to renderedList)
  public filterFields: Array<String>;  // Name of the field of the list where to apply the filter (filterText)

  public orderConf = {
    field    : '',          // Name of the field of the list to order the list by (fields[0])
    fields   : [],          // Array with all the order fields
    reverse  : false,       // Whether the list is ordered asc (false) or desc (true)
    onChange : (orderField) => this.setOrder.next(orderField) // Function to trigger a new order
  };

  public rowsPerPage: number;       // Max number of rows per page of the pagination
  public currentPage: number;       // Current page of the pagination
  public totalPages: number;        // Calculation of the total number of pages



  constructor(customInit:any = {}) {
    console.log('constructor', customInit);

    // Default values (to be overriden by constructor param if needs be)
    const defaultState = {
      loadedList   : [],
      renderedList : [],
      filterText   : '',
      filterFields  : [],
      orderFields  : [],
      orderReverse : false,
      rowsPerPage  : 15,
      currentPage  : 1,
      totalPages   : 1
    };

    // If 'filteredField', add it to the 'filteredFields[]'
    if (customInit.hasOwnProperty('filterField')) {
      customInit.filterFields = customInit.filterFields || [];
      customInit.filterFields.unshift(customInit.filterField);
    }

    const iniState:any = { ...defaultState, ...customInit };
    this.exposeState(iniState);

    this.setContent = new Rx.BehaviorSubject(iniState.loadedList);

    // --------------------------------------------------

    // List content changes
    const content$ = this.setContent.pipe(
      RxOp.map((loadedList) => {
        return { loadedList, type: 'content'};
      })
    );

    // List filter
    const filter$ = this.setFilter.pipe(
      RxOp.debounceTime(200),
      RxOp.map((filterText) => ({ filterText, type: 'filter' }))
    );

    // List order
    const order$ = this.setOrder.pipe(
      RxOp.map((orderField) => ({ orderField, type: 'order' }))
    );

    // List Pagination
    const page$ = this.setPage;
    // const page$ = this.setPage.pipe();

    // List Render (mini Reducer)
    this.render$ = Rx.merge(order$, filter$, content$, page$).pipe(
      RxOp.scan((state, action:any) => {
        console.log('Reducer pipe ----> ', action);

        // Update the new state acording ot the actions
        // content ----> action.loadedList
        // filter -----> action.filterText
        // order ------> action.orderField
        // paginate ---> action.rowsPerPage
        // nextPage ---> -
        // prevPage ---> -

        switch (action.type) {
          case 'content':   state.loadedList = action.loadedList; break;
          case 'filter':    state.filterText = action.filterText; break;
          case 'order':     if (state.orderFields[0] !== action.orderField) {
                              let fieldPos = state.orderFields.indexOf(action.orderField);
                              if (fieldPos >= 0) {
                                 state.orderFields.splice(fieldPos, 1);
                              }
                              state.orderFields.unshift(action.orderField);
                              state.orderReverse = false;
                            } else {
                              state.orderReverse = !state.orderReverse;
                            }
                            break;
          case 'paginate': state.rowsPerPage = action.rowsPerPage; break;
          case 'nextPage': state.currentPage++; break;
          case 'prevPage': state.currentPage--; break;
        }

        // --- Generate output (renderedList) ---

        state.renderedList = state.loadedList;

        // Filter list
        if (!!state.filterText) {
          state.renderedList = this.filterList(state.renderedList, state.filterText, state.filterFields);
        }

        // Order list
        if (!!state.orderFields && state.orderFields.length > 0) {
          state.renderedList = this.orderList(state.renderedList, state.orderFields, state.orderReverse);
        }

        // Truncate pagination
        if (state.rowsPerPage > 0) {
          state.totalPages = Math.ceil(state.renderedList.length / state.rowsPerPage);

          if (state.currentPage < 1) { state.currentPage = 1; }
          if (state.currentPage > state.totalPages) { state.currentPage = state.totalPages; }

          state.renderedList = state.renderedList.filter((item, ind) => {
            const offSet = (state.currentPage - 1) * state.rowsPerPage;
            const limit = state.currentPage * state.rowsPerPage;
            return (ind >= offSet && ind < limit);
          });
        }

        this.exposeState(state);

        return state;
      }, iniState )
    );

    this.renderList$ = this.render$.pipe(RxOp.map(res => res.renderedList));

  }

  // Update the class members as shortcut to current state (to be used out of subscriptions)
  private exposeState = (state) => {
    this.loadedList   = state.loadedList;
    this.filterText   = state.filterText;
    this.filterFields = state.filterFields;
    this.rowsPerPage  = state.rowsPerPage;
    this.currentPage  = state.currentPage;
    this.totalPages   = state.totalPages;
    this.renderedList = state.renderedList;

    this.orderConf.field   = state.orderFields[0];
    this.orderConf.fields  = state.orderFields;
    this.orderConf.reverse = state.orderReverse;
  };

  // ---------------- Public methods ------------------------
  public filter = (filterText) => this.setFilter.next(filterText);
  public order  = (orderField) => this.setOrder.next(orderField);

  public paginate = (rowsPerPage) => this.setPage.next({ rowsPerPage, type: 'paginate' });
  public nextPage = () => this.setPage.next({ type: 'nextPage' });
  public prevPage = () => this.setPage.next({ type: 'prevPage' });

  public load = (loadedList) => { // Sync loading
    this.setContent.next(loadedList);
    this.loadingStatus = 2;
  };

  // Loads the content of the list from a promise that resolves it
  public loadFromPromise = (loadPromise) => {
    this.loadingPromise = loadPromise;
    this.loadingStatus = 1;
    return loadPromise.then((listContent) => {
      this.load(listContent);
      this.loadingStatus = 2;
      return listContent;
    });
  };

  // Connects an incoming observable (that returns status and content) to the content subject
  public loadFromObs = (contentObs$:Rx.Observable<{ status: number, content: any }>, callbackFunc?) => {
    this.loadingStatus = 1;
    contentObs$.subscribe((state) => {
      this.loadingStatus = state.status;
      if (state.status === 2) {
        this.setContent.next(state.content);
        if (!!callbackFunc && typeof callbackFunc === 'function') {
          callbackFunc(state.content);
        }
      }
    });
  };


  // Function to filter the list (default filter on render)
  public filterList = (list: Array<any>, filterText: string, filterFields: Array<string>): Array<any> => {
    let matchPattern = filterText.toLowerCase();
    return list.filter((item) => {
      let isMatch = false;
      for (let ind = 0; ind <= filterFields.length; ind++) {
        let field = filterFields[ind];
        if (item.hasOwnProperty(field)) {
          isMatch = isMatch || item[field].toLowerCase().indexOf(matchPattern) >= 0;
        }
      }
      return isMatch;
    });
  };

  // Function to order the list (default order on render)
  public orderList = (list: Array<any>, orderFields: Array<string>, orderReverse: boolean): Array<any> => {
    return list.sort((itemA, itemB) => {
      const reVal = !!orderReverse ? -1 : 1;

      // Iterate all fields until we find a difference and can tell which goes first
      for (let ind = 0; ind < orderFields.length; ind++) {
        let valA = itemA[orderFields[ind]];
        let valB = itemB[orderFields[ind]];

        if (!isNaN(valA) && !isNaN(valB)) { // If numbers, compare using number type
          valA = Number(valA);
          valB = Number(valB);
        }

        if (valA != valB) { // If not equal, return which goes first
          return (valA > valB ? reVal : -reVal);
        }
      }
      return reVal;
    });
  }

}


