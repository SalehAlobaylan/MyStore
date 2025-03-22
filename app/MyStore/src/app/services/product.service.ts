import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../modules/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private platformId = inject(PLATFORM_ID);
  
  // Safe API URL that works in both browser and server environments
  private getApiUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : '/api';
    }
    // Default for server-side rendering
    return '/api';
  }

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    // For server-side rendering, return empty data to avoid HTTP requests
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    
    return this.http.get<Product[]>(`${this.getApiUrl()}/products`).pipe(
      catchError(() => this.http.get<Product[]>('assets/Nike.Nike.json'))
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.getApiUrl()}/products/${id}`);
  }

  addProduct(product: Product): Observable<void> {
    return this.http.post<void>(`${this.getApiUrl()}/products`, product);
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(`${this.getApiUrl()}/products/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getApiUrl()}/products/${id}`);
  }
}