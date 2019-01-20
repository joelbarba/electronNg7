import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PotsListComponent } from './pots-list/pots-list.component';
import { JbUiLibModule } from '../../jb-ui-lib/jb-ui-lib.module';
import { FormsModule, FormControl, FormGroup } from '@angular/forms';

@NgModule({
  declarations: [PotsListComponent],
  exports: [PotsListComponent],
  imports: [CommonModule, FormsModule, JbUiLibModule]
})
export class PotsModule { }
