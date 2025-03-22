import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, switchMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../modules/product';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl: string;
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Safe initialization that works in both browser and server
    this.apiUrl = isPlatformBrowser(this.platformId) && window.location.hostname === 'localhost'
      ? 'http://localhost:3000/api'
      : '/api';
  }

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