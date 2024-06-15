import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page } from '../shared/dto/page';
import { Product } from '../shared/dto/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';
  constructor(private http : HttpClient) { 
  }

  getAllProducts(page : number , size : number): Observable<Page<Product>>{
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      return this.http.get<Page<Product>>(this.apiUrl, { params });
  }

}
