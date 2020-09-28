import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';



/*
Intercepts the HTTP request to fix the server URL
https://angular.io/guide/http#intercepting-requests-and-responses
*/
@Injectable()
export class ServerURLInterceptor implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // Server API url
    const serverUrl = 'http://localhost:58780/';

    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // Clone the request and set the new header in one step.
    const authReq = req.clone({
      url: serverUrl + req.url
    });


    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}


