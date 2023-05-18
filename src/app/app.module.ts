import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { environment } from '../environments/environment'



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: 'URI_ROOT', useValue: environment.URI_ROOT },
    { provide: 'URI_MELI', useValue: environment.URI_MELI },
    { provide: 'URI_MELI_PUBLIC', useValue: environment.URI_MELI_PUBLIC },
    { provide: 'URI_RESET_PASS', useValue: environment.URI_RESET_PASS },
    { provide: 'URI_UPLOAD_BUCKET', useValue: environment.URI_UPLOAD_BUCKET },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
