import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Job } from './../Models/job.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
const reportURL = 'http://192.168.145.99:5001/api';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

constructor( private http: HttpClient) { }


  getReportCusTomer(): Observable<string>  {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<string>(reportURL + '/export/listCustomer');
  }
  getReportJobList(): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.get<string>(reportURL + '/export/joblist');
  }

  getReportCusTomerByJob(job_id: number): Observable<string>  {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    // const url = `${environment.apiBaseURL}/export/${job_id}`;
    return this.http.get<string>(reportURL + '/export/'+ job_id);
}
}
