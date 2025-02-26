import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../modules/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api'; // Backend API URL

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      switchMap((products) => {
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

// const products = [
//   {
//     "id": 0,
//     "title": "First Product",
//     "price": 24.99,
//     "rating": 4.3,
//     "shortDescription": "This is a short description of the First Product",
//     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     "categories": ["electronics", "hardware"]
//   },
//   {
//     "id": 1,
//     "title": "Second Product",
//     "price": 64.99,
//     "rating": 3.5,
//     "shortDescription": "This is a short description of the Second Product",
//     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     "categories": ["books"]
//   },
//   {
//     "id": 2,
//     "title": "Third Product",
//     "price": 74.99,
//     "rating": 4.2,
//     "shortDescription": "This is a short description of the Third Product",
//     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     "categories": ["electronics"]
//   },
//   {
//     "id": 3,
//     "title": "Fourth Product",
//     "price": 84.99,
//     "rating": 3.9,
//     "shortDescription": "This is a short description of the Fourth Product",
//     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     "categories": ["hardware"]
//   },
//   {
//     "id": 4,
//     "title": "Fifth Product",
//     "price": 94.99,
//     "rating": 5,
//     "shortDescription": "This is a short description of the Fifth Product",
//     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     "categories": ["electronics", "hardware"]
//   },
//   {
//     "id": 5,
//     "title": "Sixth Product",
//     "price": 54.99,
//     "rating": 4.6,
//     "shortDescription": "This is a short description of the Sixth Product",
//     "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     "categories": ["books"]
//   }
// ];
