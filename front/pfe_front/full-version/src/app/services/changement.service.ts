import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Changement } from 'models/changement.model';
import { StatutChangement } from 'models/statutChangement.enum';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {User} from "../auth/models";

@Injectable({
  providedIn: 'root'
})
export class ChangementService {

  private baseUrl = 'http://localhost:8080/api/v1/changement';


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
  addChangement(userid:number,formData: FormData): Observable<any> {
    return this.http.post<Changement>(this.baseUrl+'/add/'+userid, formData
    ).pipe(catchError(this.handleError));
  }

  findChangementById(id: number): Observable<Changement> {
    return this.http.get<Changement>(`${this.baseUrl+'/un-incident'}/${id}`);
  }

  getAllChangements(): Observable<Changement[]> {
    return this.http.get<Changement[]>(this.baseUrl+'/list');
  }


  deleteChangement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl+'/delete'}/${id}`);
  }

  updateChangement(id: number, FormData: FormData): Observable<Changement> {
    return this.http.put<Changement>(`${this.baseUrl+'/update'}/${id}`, FormData);
  }

  // Additional operations as needed

  closeChangement(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl+'/close'}${id}`, null);
  }

  getResolvedChangementsWithinDateRange(startDate: Date, endDate: Date): Observable<Changement[]> {
    let params = new HttpParams()
        .set('startDate', startDate.toISOString())
        .set('endDate', endDate.toISOString());

    return this.http.get<Changement[]>(`${this.baseUrl+'/resolved'}`, { params });
}

  startWorkOnChangement(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl+'/startWork'}/${id}`, null);
  }

  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.baseUrl}/download/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  affectChangementToIssue(data:any) :Observable<any>{
    return this.http.put<any>(`${this.baseUrl+'/affecter/'}${data.id}`,data);

  }

  getAllChangementsFromUser(id:number): Observable<Changement[]> {
    return this.http.get<Changement[]>(this.baseUrl+'/getresponsablechangement/'+id);
  }

  notifyAccepted(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl+'/notify'}/${id}`, null);
  }


}

