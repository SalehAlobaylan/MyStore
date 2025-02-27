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
      // Update quantity if item exists added it to in cart 
      // to make the user change the quantity in cart also
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
