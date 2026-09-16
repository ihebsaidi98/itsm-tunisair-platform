import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvenementIncident } from 'models/evenementIncident.enum';
import { Incident } from 'models/incident.model';
import { StatutIncident } from 'models/statutIncident.enum';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Probleme} from "../../models/probleme.model";

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private baseUrl = 'http://localhost:8080/api/v1/incident';

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
  addIncident(formData: FormData): Observable<any> {
    return this.http.post<Incident>(this.baseUrl+'/add/'+formData.get('user_id'), formData)
        .pipe(catchError(this.handleError));
  }

  findIncidentById(id: number): Observable<Incident> {
    return this.http.get<Incident>(`${this.baseUrl+'/un-incident'}/${id}`);
  }

  getAllIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.baseUrl+'/list');
  }


  deleteIncident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl+'/delete'}/${id}`);
  }

  updateIncident(id: number, incidentDetails: FormData): Observable<Incident> {
    return this.http.put<Incident>(`${this.baseUrl+'/update'}/${id}`, incidentDetails);
  }

  // Additional operations as needed

  getIncidentsByStatut(statut: StatutIncident): Observable<Incident[]> {
    const params = { statut };
    return this.http.get<Incident[]>(`${this.baseUrl+'/incident/byStatut'}`, { params });
  }

  closeIncident(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl+'/close'}${id}`, null);
  }

  getIncidentsByCategory(categorie: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.baseUrl+'/category'}${categorie}`);
  }

  getAllArchivedIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.baseUrl+'/archived');
  }

  getResolvedIncidentsWithinDateRange(startDate: Date, endDate: Date): Observable<Incident[]> {
    let params = new HttpParams()
        .set('startDate', startDate.toISOString())
        .set('endDate', endDate.toISOString());

    return this.http.get<Incident[]>(`${this.baseUrl+'/resolved'}`, { params });
}

  countIncidentsByCategory(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(this.baseUrl+'/countByCategory');
  }

  processIncidentState(id: number, event: EvenementIncident): Observable<void> {
    return this.http.post<void>(`${this.baseUrl+'/process'}/${id}/${event}`, event);
  }

  startWorkOnIncident(id: number): Observable<void> {
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

  findIncidentsByUserId(id: number): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.baseUrl+'/incidentithiduser'}/${id}`);
  }

  archiveIncident(id: number): Observable<Incident[]> {
    return this.http.put<Incident[]>(`${this.baseUrl+'/archive'}/${id}`,null);
  }
  UnarchiveIncident(id: number): Observable<Incident[]> {
    return this.http.put<Incident[]>(`${this.baseUrl+'/unarchive'}/${id}`,null);
  }

  notifypeople(id:number,emails:any[]) {
    return this.http.post<Incident>(this.baseUrl+`/notify/${id}`, emails
    ).pipe(catchError(this.handleError));
  }

  getAllTypesIncidents() {
    return this.http.get<Incident[]>(this.baseUrl+'/alltypes');
  }
}

