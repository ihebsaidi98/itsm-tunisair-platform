import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'models/user.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/v1/user';

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


  // CRUD operations for incidents


  findUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl+'/list');
  }


  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl+'/delete'}/${id}`);
  }

  updateUser(id: number, FormData: FormData): Observable<User> {
    return this.http.put<User>(`${this.baseUrl+'/update'}/${id}`, FormData);
  }

  // Additional operations as needed

  closeUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl+'/close'}${id}`, null);
  }

  getResolvedUsersWithinDateRange(startDate: Date, endDate: Date): Observable<User[]> {
    let params = new HttpParams()
        .set('startDate', startDate.toISOString())
        .set('endDate', endDate.toISOString());

    return this.http.get<User[]>(`${this.baseUrl+'/resolved'}`, { params });
}

  startWorkOnUser(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl+'/startWork'}/${id}`, null);
  }

  getAffectedIssues(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl+'/issues'}/${id}`);
  }

  updatePassword(User: User): Observable<void> {
    return this.http.put<void>(`${this.baseUrl+'/change-password'}`, User);
  }



}

