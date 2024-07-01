import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private searchKeywordSubject = new Subject<string>();
  searchKeyword$ = this.searchKeywordSubject.asObservable();

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  loggedIn = this.loggedInSubject.asObservable();

  setSearchKeyword(keyword: string): void {
    this.searchKeywordSubject.next(keyword);
  }
  setLoggedIn(loggedIn: boolean) {
    this.loggedInSubject.next(loggedIn);
  }
  constructor() { }
}
