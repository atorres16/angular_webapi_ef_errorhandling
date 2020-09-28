import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { catchError, retry } from 'rxjs/operators';
import { HttpErrorHandler } from './http-error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(
    private httpClient: HttpClient,
    private httpErrorHandlerService: HttpErrorHandler) {
  }

  url = 'api/employees/';


  getEmployees = (): Observable<Employee[]> => {

    return this.httpClient.get<Employee[]>(
      this.url + 'GetEmployees'
    )
      .pipe(
        // retry 3 times
        retry(3),
        catchError(this.httpErrorHandlerService.handleError)
      );
  }
}
