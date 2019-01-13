import { ipcRenderer } from 'electron';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListHeaderColComponent } from './list-header-col/list-header-col.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListHeaderColComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // FormControl,
    // FormGroup,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
