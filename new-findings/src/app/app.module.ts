import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserInsightComponent } from './user-insight/user-insight.component';
import { GrpupBarChartDirective } from './directive/grpup-bar-chart.directive';
import { TitleCasePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    UserInsightComponent,
    GrpupBarChartDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers : [TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
