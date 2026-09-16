import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'models/user.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RagService {

  private baseUrl = 'http://127.0.0.1:5000/';

  constructor(private http: HttpClient) {}


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // Optionally, log the error to an external service
    console.error(errorMessage);
    return throwError(errorMessage);
  }


  getAiAnwser(data: any,filename:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${filename}`, data);
  }



}

