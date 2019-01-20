import { ipcRenderer } from 'electron';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListHeaderColComponent } from './list-header-col/list-header-col.component';
import { JbUiLibModule } from './jb-ui-lib/jb-ui-lib.module';
import { ShellUiModule } from './shell-ui/shell-ui.module';
import { PagesModule } from './pages/pages.module';
import { PotsModule } from './pages/pots/pots.module';

@NgModule({
  declarations: [
    AppComponent,
    ListHeaderColComponent,
  ],
  imports: [
    BrowserModule,
    // JbUiLibModule,
    ShellUiModule,
    PagesModule,
    // PotsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
