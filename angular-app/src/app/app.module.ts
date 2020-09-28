import { HttpErrorHandler } from './services/http-error-handler.service';
import { EmployeesService } from './services/employees.service';
import { httpInterceptorProviders } from './http-interceptors/index';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EmployeesComponent } from './components/employees/employees.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    httpInterceptorProviders,
    HttpErrorHandler,
    EmployeesService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
