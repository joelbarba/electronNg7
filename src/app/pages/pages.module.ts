import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PotsModule } from './pots/pots.module';
import { PageViewComponent } from './page-view/page-view.component';

@NgModule({
  declarations: [PageViewComponent],
  exports: [PageViewComponent],
  imports: [CommonModule, PotsModule]
})
export class PagesModule { }
