import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DumbMsgComponent } from './dumb-msg/dumb-msg.component';


@NgModule({
  declarations: [DumbMsgComponent],
  exports: [DumbMsgComponent],
  imports: [CommonModule]
})
export class JbUiLibModule { }
