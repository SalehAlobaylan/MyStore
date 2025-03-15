import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../modules/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api'; // Backend API URL if the data came from backend
  // private apiUrl = 'mystoredb.cqc8bwsn9skh.us-east-1.rds.amazonaws.com/api'; // backend API is hosted on Elastic Beanstalk


  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      switchMap((products) => {  // here sometimes the backend don't send data
        // so if the database is empty the backend is useless
        // and if it empty the website will be empty so i made another way to get data
        // from static json file not from Mongo database
        // the data is the same in the two ways so it will work
        if (products && products.length > 0) {
          return of(products);
        }
        console.log('No products found in database, loading from JSON file');
        return this.http.get<Product[]>('assets/Nike.Nike.json');
      }),
      catchError((error) => {
        console.error('API call failed:', error);
        return this.http.get<Product[]>('assets/Nike.Nike.json');
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  addProduct(product: Product): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/products`, product);
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/products/${product.id}`,
      product
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}