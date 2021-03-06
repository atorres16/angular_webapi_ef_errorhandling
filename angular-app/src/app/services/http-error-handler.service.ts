import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandler {
  constructor() { }
  public onError: EventEmitter<string> = new EventEmitter<string>();

  handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `Error body next:`);
      console.error(error.error);

    }
    // Return an observable with a user-facing error message.
    this.onError.emit('Something bad happened; please try again later.');
    return throwError(
      'Something bad happened; please try again later.');
  }
}
