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
