import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3001';

  addApplication(data: FormData) {
    return this.http.post<any>(`${this.apiUrl}/job/application`, data);
  }
  editApplication(data: FormData) {
    return this.http.put<any>(`${this.apiUrl}/job/application/edit`, data, {
      responseType: 'text' as 'json',
    });
  }

  getApplications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/job/applications`);
  }
  getfile(filename: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/job/applicant/files/${filename}`,
      { responseType: 'blob' as 'json' }
    );
  }
  getFiles(fileNames: string[]) {
    return forkJoin(fileNames.map((name) => this.getfile(name)));
  }
}
