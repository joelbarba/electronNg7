import { ipcRenderer } from 'electron';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JbUiLibNg7Module } from 'jb-ui-lib-ng7';

import { AppComponent } from './app.component';

import { ShellUiModule } from './shell-ui/shell-ui.module';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    JbUiLibNg7Module,
    ShellUiModule,
    PagesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
