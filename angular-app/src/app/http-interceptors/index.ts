/* "Barrel" of Http Interceptors */
/*https://stackblitz.com/angular/oevaymgooko?file=src%2Fapp%2Fhttp-interceptors%2Findex.ts*/

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ServerURLInterceptor } from './server-url-interceptor';


/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ServerURLInterceptor, multi: true }
];

