import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../modules/product';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Always use relative API URLs to leverage the proxy configuration
  private apiUrl = '/api';
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getProducts(): Observable<Product[]> {
    // Check if we're in a browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return of([]); // Return empty array during SSR
    }
    
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
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