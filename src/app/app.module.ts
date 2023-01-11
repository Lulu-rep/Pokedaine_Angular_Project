import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { TachesComponent } from './component/taches/taches.component';
import { FiltreTachePipe } from './pipe/filtre-tache.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TachesComponent,
    FiltreTachePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
 ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
