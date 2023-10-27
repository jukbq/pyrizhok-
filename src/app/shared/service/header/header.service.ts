import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private headerClickSubject = new Subject<string>();
  headerClick$ = this.headerClickSubject.asObservable();

  private pageInfoSubject = new Subject<any>();
  pageInfo$ = this.pageInfoSubject.asObservable();

  emitHeaderClick(menuItem: string) {
    this.headerClickSubject.next(menuItem);
  }

  emitPageInfo(pageInfo: any) {
    this.pageInfoSubject.next(pageInfo);
  }


}
