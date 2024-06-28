import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private searchKeywordSubject = new Subject<string>();
  searchKeyword$ = this.searchKeywordSubject.asObservable();

  setSearchKeyword(keyword: string): void {
    this.searchKeywordSubject.next(keyword);
  }
  constructor() { }
}
