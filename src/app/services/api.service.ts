import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, shareReplay, switchMap, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public apiUrl = "/api/QuoteRequest";
  // I used a proxy config here because of CORS issues (src/proxy.conf.json) defined for ng serve in the development env
  // public apiUrl = "https://jayridechallengeapi.azurewebsites.net/api/QuoteRequest";

  constructor(
    private httpClient: HttpClient
  ) {}

  // in lack of an SDK just use the raw HttpClient get method for now - in a real scenario, I would use an SDK or framework to handle that, along with guards to intercept ever request for authentication etc.
  public getTravelOptionsData(): Observable<any> {
      const obs = this.httpClient.get(this.apiUrl)
      .pipe(
        shareReplay(1),
        // tap(response => console.log(JSON.stringify(response))),
        switchMap((response) => {
            return of(response);
        }),
        catchError((error) => this.handleError(error))
      );
      return obs;
  }

  // this error would obviously be handled differntly, maybe retrying, showing the user what the problem is etc.
  public handleError(error: any): Observable<any> {
    if (error) {
      console.error(`${error}`);
    }
    if (error === "Server error") { // to be defined how server error looks like
      return of(null);
    }
    if (error instanceof HttpErrorResponse) {
      console.error(`Error is of type HttpErrorResponse`);
      return of(error);
    } else {
      return of(error);
    }
  }
}