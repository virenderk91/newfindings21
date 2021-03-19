import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserInsightComponent } from './user-insight/user-insight.component';
import { GrpupBarChartDirective } from './directive/grpup-bar-chart.directive';
import { TitleCasePipe } from '@angular/common';
import { AllTimeSaCountComponent } from './all-time-sa-count/all-time-sa-count.component';
import { AppLineChartDirective } from './directive/app-line-chart.directive';

@NgModule({
  declarations: [
    AppComponent,
    UserInsightComponent,
    GrpupBarChartDirective,
    AllTimeSaCountComponent,
    AppLineChartDirective
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
