import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Probleme } from 'models/probleme.model';
import { StatutProbleme } from 'models/statutProbleme.enum';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProblemeService {

  private baseUrl = 'http://localhost:8080/api/v1/probleme';

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
  addProbleme(formData: FormData): Observable<any> {
    return this.http.post<Probleme>(this.baseUrl+`/add/${formData.get('user_id')}`, formData
    ).pipe(catchError(this.handleError));
  }

  findProblemeById(id: number): Observable<Probleme> {
    return this.http.get<Probleme>(`${this.baseUrl+'/un-probleme'}/${id}`);
  }

  getAllProblemes(): Observable<Probleme[]> {
    return this.http.get<Probleme[]>(this.baseUrl+'/list').pipe(catchError(this.handleError));
  }

  findProblemesByUserId(id: number): Observable<Probleme[]> {
    return this.http.get<Probleme[]>(`${this.baseUrl+'/problemwithiduser'}/${id}`);
  }


  deleteProbleme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl+'/delete'}/${id}`);
  }

  updateProbleme(id: number, FormData: FormData): Observable<Probleme> {
    return this.http.put<Probleme>(`${this.baseUrl+'/update'}/${id}`, FormData);
  }

  // Additional operations as needed

  closeProbleme(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl+'/close'}${id}`, null);
  }

  getResolvedProblemesWithinDateRange(startDate: Date, endDate: Date): Observable<Probleme[]> {
    let params = new HttpParams()
        .set('startDate', startDate.toISOString())
        .set('endDate', endDate.toISOString());

    return this.http.get<Probleme[]>(`${this.baseUrl+'/resolved'}`, { params });
}

  startWorkOnProbleme(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl+'/startWork'}/${id}`, null);
  }

  downloadFile(fileName: string): Observable<Blob> {
    const url = `${this.baseUrl}/download/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  affectPeople(data: { problemId: number; users: number[] }) {
    return this.http.post<Probleme>(this.baseUrl+`/affect/${data.problemId}`, data.users
    ).pipe(catchError(this.handleError));
  }
  notifypeople(id:number,emails:any[]) {
    return this.http.post<Probleme>(this.baseUrl+`/notify/${id}`, emails
    ).pipe(catchError(this.handleError));
  }

  getAllArchivedProblemes(): Observable<Probleme[]> {
    return this.http.get<Probleme[]>(this.baseUrl+'/archived').pipe(catchError(this.handleError));
  }

  archiveProbleme(id: number): Observable<Probleme[]> {
    return this.http.put<Probleme[]>(`${this.baseUrl+'/archive'}/${id}`,null);
  }
  unarchiveProbleme(id: number): Observable<Probleme[]> {
    return this.http.put<Probleme[]>(`${this.baseUrl+'/unarchive'}/${id}`,null);
  }

  getAllTypesProblemes() {
    return this.http.get<Probleme[]>(this.baseUrl+'/alltypes')
  }
}

