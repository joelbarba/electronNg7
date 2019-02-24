import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PotsListComponent } from './pots-list/pots-list.component';
import { FormsModule, FormControl, FormGroup } from '@angular/forms';

import { BfUiLibModule } from 'bf-ui-lib';



@NgModule({
  declarations: [PotsListComponent],
  exports: [PotsListComponent],
  imports: [
    CommonModule,
    FormsModule,
    BfUiLibModule
    // JbUiLibModule,
  ]
})
export class PotsModule { }
