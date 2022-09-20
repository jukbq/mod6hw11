import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { LoginRequest } from '../../interfaces/accoumt';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public isUserLogin$ = new Subject<boolean>();
  private url: any = 'https://busy-stitch-archer.glitch.me';
  private api = { users: `${this.url}/users` };

  constructor(
    private http: HttpClient
    ) { };


  login(sighin: LoginRequest): Observable<any>{
      return this.http.get(`${this.api.users}?email=${sighin.email}&pass=${sighin.password}`)
    }
}
