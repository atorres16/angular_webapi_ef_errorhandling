# Connect Angular with Web API 
In this exercise we're creating a DotNet Web API service that uses Entity Framework to connect to a MS SQL Server instance to get some data, we're also creating an Angular app to display data from this service, in the process we're including an Http interceptor to fix the server's url for every request and adding some Http error handling.

## Requirements
* You have a version of Microsoft SQL Server engine available
* You should have some notion of how Entity Framework, Angular and Web API work
* Read [Observables overview](https://angular.io/guide/observables)
* Read [RxJS Library](https://angular.io/guide/rx-library)
* Read [Observables in Angular](https://angular.io/guide/observables-in-angular)
* Read [Angular Http Guide](https://angular.io/guide/http)
* Read [Angular Routing & Navigation](https://angular.io/guide/router)


  
## Works with
* Dot NET Framework 4.8
* Microsoft Asp Net Web API 5.2.7
* Entity Framework 6.4.4
* Visual Studio 2019
## Steps
### Web API project
1. Create an ASP Net Web API project, and for this tutorial:
	* Don't enable Windows authentication
	* Don't enable  HTTPS
	* If asked, include MVC and Web API references
#### Entity Framework
2. Install EntityFramework, in the Nuget Package Manager Console run:
	```
	install-package entityframework
	```
3. Let's create the ***Employee*** entity. Create a folder and name it ***Entitities***
4. Inside ***Entities*** create a file and name it ***Employee.cs***
5. In ***Employee.cs*** add this code:
	```csharp
	public class Employee
	{
	    public int Id { get; set; }
	    public string Name { get; set; }
	    public string Email { get; set; }
	}
	```
6. Create the DbContext. Inside ***Entities*** create a file and name it ***DataContext.cs***	
7. Inside ***DataContext.cs*** include this code
	```csharp
	using System.Data.Entity;
	...
	public class DataContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }
    }
	```
8. We'll need to include the connection string inside the ***web.config*** file. Open ***web.config*** and include a connectionStrings element with a connection string inside at the root level of the xml, modify the connection string to fit your development environment:
	```xml
	<?xml version="1.0" encoding="utf-8"?>
	<configuration>
		...
		  <connectionStrings>
		    <add name="DataContext"
		       providerName="System.Data.SqlClient"
		       connectionString="Data Source=(local)\SQLEXPRESS;Initial Catalog=AngularWebAPITestDB;Integrated Security=True"/>
		  </connectionStrings>
	</configuration>
	```
9. To enable the Entity Framework migrations: In the console run
	```
	enable-migrations
	```	
10. Add the first migration. In the console run:
	```
	add-migration "initial migration"
	```	
11.	To create the database in SQL Server run:
	```
	update-database
	```
12. Verify in your SQL Management Studio that the  database was created correctly
13. In order to do some tests later, manually insert a record into the **Employees** table
    ![](https://github.com/atorres16/angular_webapi_ef_errorhandling/raw/master/images/2020-09-16-11-23-43.png)
#### Add a Controller    
14. Create the Employees controller by right clicking the ***Controllers*** folder and selecting ***Add Controller***
15. In the ***Add new Scaffolded Item*** window, select ***Web API 2 Controller - Empty***
![](https://github.com/atorres16/angular_webapi_ef_errorhandling/raw/master/images/2020-09-16-08-56-44.png)
16. In Controller name, write ***Employees Controller***
17. Open ***EmployeesController.cs*** and alter it like this:
    ```csharp

    using YOUR_NAMESPACE.Entities;
    using System.Threading.Tasks;
    ...

    [RoutePrefix("api/Employees")]
    public class EmployeesController : ApiController
    {

        [HttpGet]
        [Route("GetEmployees")]
        public async Task<IHttpActionResult> GetEmployeesAsync()
        {
            try
            {
                using (DataContext db = new DataContext())
                {
                    return Ok(await db.Employees.ToListAsync());
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
    ```
    *In this code we're creating the Employees Controller with one action that retrieves a list of employees using Entity Framework.*

    * Fix reference for YOUR_NAMESPACE.Entities
    * **RoutePrefix and Route**: We're setting the routing of the controller and action by using attributes. Read [Attribute Routing in WebAPI 2](https://docs.microsoft.com/en-us/aspnet/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2)
#### Setup WebApi Routing    
18. Run the app, and try to call the action by pasting this in the browser (don't forget change the port)
    ```
    http://localhost:[port]/api/Employees/GetEmployees
    ```
19. You'll get this error:
    ```xml
    <?xml version="1.0" encoding="ISO-8859-1"?>
    <Error>
    <Message>No HTTP resource was found that matches the request URI 'http://localhost:58780/api/Employees/GetEmployees'.</Message>
    <MessageDetail>No action was found on the controller 'Employees' that matches the request.</MessageDetail>
    </Error>
    ```    
    *The browser can't find the Employees Controller*
20. Let's adjust the routing in Web API, open ***App_Start/WebApiConfig.cs*** and change:
    ```csharp
    ...
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional}
            );
    ...   
    ```
    to this
    ```csharp
    ...
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new
                {
                    action = RouteParameter.Optional,
                    id = RouteParameter.Optional
                }
            );
    ...   
    ```
    *Here we're telling Web API to consider the action as a component of the route to be part of the requests calls*
21. Run the app and try again
    ```
    http://localhost:[port]/api/Employees/GetEmployees
    ```
22. You should get some XML like this:
    ```xml
    <?xml version="1.0" encoding="ISO-8859-1"?>
    <ArrayOfEmployee xmlns="http://schemas.datacontract.org/2004/07/Angular_EF_Web_API.Entities" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
    <Employee>
    <Email>jdoe@email.com</Email>
    <Id>1</Id>
    <Name>Juan Doe</Name>
    </Employee>
    </ArrayOfEmployee>
    ```
#### Return Json instead of XML    
23. For this tutorial I prefer using JSON instead of XML, so let's ask WebAPI to send JSON. Open **App_Start/WebApiConfig.cs*** and include these lines:
    ```csharp
     using System.Net.Http.Headers;
     ...

     public static void Register(HttpConfiguration config)
        {
            
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            config.Formatters.JsonFormatter.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.None;
            ...
            
    ```
24. Run you app again
    ```
    http://localhost:[port]/api/Employees/GetEmployees
    ```
    You should see the same data, but now in Json format
    ```json
    [{"Id":1,"Name":"Juan Doe","Email":"jdoe@email.com"}]
    ``` 
#### Enable CORS
Since the client app and the web service run from different domains, we will need to enable [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) in the web service   
25. To enable ***CORS*** follow [this tutorial](https://softdevnotesntips.blogspot.com/2020/09/how-to-enable-cors-between-angular-app.html).

### Angular App
1. Create the Angular app in a separate folder by running in your terminal:
    ```
    ng new angular-app
    ```
#### Add Http support
2. Open ***src/app/app.module.ts*** and import the Angular ***HttpClientModule***.
```javascript
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { HttpClientModule } from '@angular/common/http';
    @NgModule({
    imports: [
            BrowserModule,
            // import HttpClientModule after BrowserModule.
            HttpClientModule,
        ],
    declarations: [
            AppComponent,
        ],
    bootstrap: [ AppComponent ]
    })
    export class AppModule {}
```    

#### Create a model    
3. Create the folder ***src/app/models***
4. Inside ***src/app/models*** create a file and name it ***employee.ts***     
5. Add this code in ***employee.ts***
    ```javascript
    export interface Employee {
    Id: number;
    Name: string;
    Email: string;
    }
    ```
#### Employee service    
6. Create the folder ***src/app/services***
7. In the terminal navigate to ***src/app/services*** and create the ***EmployeesService***
    ```
    ng g service Employees
    ```
8. Inside ***employees-service.ts*** include this code:
    ```javascript
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

    ```    
    
9. You'll have to provide the service by adding an entry into the providers array in ***app.module.ts***
    ```javascript
    providers: [
        httpInterceptorProviders,
        HttpErrorHandlerService,
        EmployeesService
    ],
    ```    
#### Employees component
10. Create folder ***src/app/components***
11. In your terminal, navigate to ***src/app/components*** and run
    ```
    ng g component Employees
    ```
    *The employees component will be created*
12. Replace the code in ***employees-component.html***
    ```html
    <p>Employees</p>
    <ul>
        <li *ngFor="let employee of Employees">
            {{employee.Name}}
        </li>
    </ul>
    ```
13. Replace the code in ***employees-component.ts***
    ```javascript
    import { EmployeesService } from './../../services/employees.service';
    import { Component, OnInit } from '@angular/core';
    import { Employee } from 'src/app/models/employee';

    @Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.css']
    })
    export class EmployeesComponent implements OnInit {

    Employees: Employee[];
    headers: any;
    constructor(private employeeService: EmployeesService) { }

    ngOnInit(): void {
        this.employeeService.getEmployees()
        .subscribe((emps:Employee[]) => {
            this.Employees = emps;
        });
    }
    }
    ```    
#### Routing    
*Add routing support in the angular app*

14. Add ***src/app/app-routing.module.ts*** and include this code

    ```javascript
    import { EmployeesComponent } from './components/employees/employees.component';
    import { AppComponent } from './app.component';
    import { NgModule, Component } from '@angular/core';
    import { Routes, RouterModule } from '@angular/router';

    const routes: Routes = [
    { path: '*', component: AppComponent },
    { path: 'employees', component: EmployeesComponent }
    ];

    @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
    })
    export class AppRoutingModule { }
    ```
15. Import the routing module in ***app.module.ts***
    ```javascript
    ...
    imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ],
    ....    
    ```

16. Replace the code in ***app.component.html*** with this
    ```html
    <a [routerLink]="['/employees']" routerLinkActive="active">Employees</a>
    <router-outlet></router-outlet>
    ```    
#### Error handling in Angular
To implement some error handling, follow the recommendations provided in the [Angular HTTP guide](https://angular.io/guide/http)  

17. In your terminal navigate to ***src/app/services*** and create a new service    
    ```
    ng g service HttpErrorHandler
    ```
18. Include this code in ***http-error-handler-service.ts***
    ```javascript
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
    ```    
19. Provide this service in ***app.module.ts***
    ```javascript
    ...
         providers: [
        httpInterceptorProviders,
        HttpErrorHandler
        ],
    ...        
    ```    
##### Global error message
Lets configure the app so anytime there's an Http error in any of the services, a generic friendly error to the user is shown.
*Actually, in the [Angular - HTTP Sample](https://stackblitz.com/angular/oevaymgooko?file=src%2Fapp%2Fconfig%2Fconfig.service.ts) the errors are ignored, I think we should show some kind of error to the end user*, in this case we show an ***alert***, but in a real project you would add a CSS popup or something. 
20. Open ***app.component.ts*** and alter it like this

```javascript
import { HttpErrorHandler } from './services/http-error-handler.service';
import { Component, OnInit } from '@angular/core';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
constructor(private httpErrorHandler: HttpErrorHandler) {
}

ngOnInit(): void {
    this.httpErrorHandler.onError.subscribe((err) => {
    alert(err);
    });
}
}
```

#### Http Interceptor to set the server URL in every request    
We haven't specified the server's URL anywhere, we could create a service to provide the url to all the data services (like ***EmployeesService***), we could repeat the URL in each data service, and there might be many ways to achieve this, for this example, we're going to use an ***HTTP Interceptor*** that will *intercept* each HTTP request and will attach the server's URL before it gets sent to the server.
21. Create the folder ***src/app/http-interceptors***
22. Inside this folder create the file ***server-url-interceptor.ts*** and include this code
```javascript
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
```
*Don't forget to replace the port in the server's URL*

23. You'll need to provide the ***Http interceptor*** to the app, create the file ***src/app/http-interceptors/index.ts*** and include this code:
 
    ```javascript
    /* "Barrel" of Http Interceptors */
    /*https://stackblitz.com/angular/oevaymgooko?file=src%2Fapp%2Fhttp-interceptors%2Findex.ts*/

    import { HTTP_INTERCEPTORS } from '@angular/common/http';

    import { ServerURLInterceptor } from './server-url-interceptor';


    /** Http interceptor providers in outside-in order */
    export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ServerURLInterceptor, multi: true }
    ];
    ```
24. Open ***app.module.ts*** and add an entry for ***httpInterceptorProviders*** in the ***providers*** array
    ```javascript
    ...
      providers: [
    httpInterceptorProviders
    ],
    ...
    ```    
25. Run both the web service and the angular app, navigate to employees, you should see the data 
   ![](https://github.com/atorres16/angular_webapi_ef_errorhandling/raw/master/images/2020-09-28-10-26-55.png)
26. Simulate an error from the service and run again, you should get an error alert, press F12 to see the error details in the console   
    ```csharp
    [HttpGet]
    [Route("GetEmployees")]
    public async Task<IHttpActionResult> GetEmployeesAsync()
    {
        try
        {
            using (DataContext db = new DataContext())
            {
                return InternalServerError(new InvalidProgramException("FAKE ERROR"));
                return Ok(await db.Employees.ToListAsync());
            }
        }
        catch (Exception ex)
        {
            return InternalServerError(ex);
        }
    }
    ```    
    ![](https://github.com/atorres16/angular_webapi_ef_errorhandling/raw/master/images/2020-09-28-10-45-54.png)
    *I think we're getting the error messages 4 times, because we're retrying the request in the employees service*

Keep playing with Angular, post an employee, should feel very straightforward  


## References
* [Angular Http Guide](https://angular.io/guide/http)
* [Attribute Routing in WebAPI 2](https://docs.microsoft.com/en-us/aspnet/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2)
* [Angular - Communicating with backend services using HTTP](https://angular.io/guide/http)
* [Angular - HTTP Sample](https://stackblitz.com/angular/oevaymgooko?file=src%2Fapp%2Fconfig%2Fconfig.service.ts)
* [Observables in Angular](https://angular.io/guide/observables-in-angular)
* [Angular - Observables](https://angular.io/guide/observables)
* [Publish - Subscribe Pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
* [Complete list of Pipe operators](https://rxjs.dev/api)
* [Angular Routing & Navigation](https://angular.io/guide/router)
* [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
* [How to enable CORS between angular and ASPNET WebAPI](https://softdevnotesntips.blogspot.com/2020/09/how-to-enable-cors-between-angular-app.html)
* [Angular HTTP Interceptor](https://angular.io/api/common/http/HttpInterceptor)
## Source Code
https://github.com/atorres16/angular_webapi_ef_errorhandling