import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../modules/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Dynamic API URL that works in both development and production  // Dynamic API URL that works in both development and production
  private apiUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'  
  : '/api';
  
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      switchMap((products) => {
        if (products && products.length > 0) {
          return of(products);
        }
        return this.http.get<Product[]>('assets/Nike.Nike.json');
      }),
      catchError(() => this.http.get<Product[]>('assets/Nike.Nike.json'))
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  addProduct(product: Product): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/products`, product);
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/products/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}