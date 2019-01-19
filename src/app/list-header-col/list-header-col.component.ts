import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-header-col',
  templateUrl: './list-header-col.component.html',
  styleUrls: ['./list-header-col.component.scss']
})
export class ListHeaderColComponent implements OnInit {
  @Input() colTitle: string;
  @Input() fieldName: string;
  @Input() orderSettings: any;
  @Output() orderEvent = new EventEmitter<string>();

  constructor() { }
  ngOnInit() { }

  clickOrder = () => {
    this.orderEvent.emit('hello');
  }
}
