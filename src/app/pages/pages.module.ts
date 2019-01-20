import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PotsModule } from './pots/pots.module';
import { PageViewComponent } from './page-view/page-view.component';
import { JbUiLibModule } from '../jb-ui-lib/jb-ui-lib.module';

@NgModule({
  declarations: [PageViewComponent],
  exports: [PageViewComponent],
  imports: [CommonModule, PotsModule, JbUiLibModule]
})
export class PagesModule { }
