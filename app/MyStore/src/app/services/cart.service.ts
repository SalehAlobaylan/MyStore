// import { Injectable } from '@angular/core';
// import { Product } from '../modules/product';

// @Injectable({
//   providedIn: 'root',
// })
// export class CartService {
//   private items: Product[] = [];

//   addToCart(product: Product) {
//     this.items.push(product);
//   }

//   getItems() {
//     return this.items;
//   }

//   clearCart() {
//     this.items = [];
//     return this.items;
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../modules/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<Product[]>([]);
  items$: Observable<Product[]> = this.itemsSubject.asObservable();

  constructor() {}

  addToCart(product: Product): void {
    const currentItems = this.itemsSubject.getValue();
    const existingItem = currentItems.find(item => item.index === product.index);
    
    if (existingItem) {
      // Update quantity if item exists
      const updatedItems = currentItems.map(item => 
        item.index === product.index 
          ? { ...item, quantity: (item.quantity || 0) + (product.quantity || 1) }
          : item
      );
      this.itemsSubject.next(updatedItems);
    } else {
      // Add new item
      this.itemsSubject.next([...currentItems, product]);
    }
  }

  updateItemQuantity(product: Product): void {
    const currentItems = this.itemsSubject.getValue();
    const updatedItems = currentItems.map(item => 
      item.index === product.index ? product : item
    );
    this.itemsSubject.next(updatedItems);
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }

  getItems(): Product[] {
    return this.itemsSubject.getValue();
  }
}
