import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../modules/product';

/**
 * Simple cart service without localStorage
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  // In-memory cart items
  private cartItems: any[] = [];
  
  // Observable for components to subscribe to
  private cartSubject = new BehaviorSubject<any[]>([]);
  public items$ = this.cartSubject.asObservable();
  
  constructor() {}
  
  // Add product to cart (with proper deep copy)
  addToCart(product: Product, quantity: number = 1): void {
    // Create a clean copy of the product to avoid reference issues
    const productCopy = JSON.parse(JSON.stringify(product));
    
    // Check if product already exists in cart by ID comparison
    const existingIndex = this.cartItems.findIndex(item => 
      item.product && item.product.id === productCopy.id
    );
    
    if (existingIndex >= 0) {
      // Update existing item quantity
      this.cartItems[existingIndex].quantity += quantity;
    } else {
      // Add as new item
      this.cartItems.push({ product: productCopy, quantity });
    }
    
    // Update observers
    this.cartSubject.next([...this.cartItems]);
    console.log('Cart updated:', this.cartItems);
  }
  
  // Remove item from cart
  removeItem(item: any): void {
    this.cartItems = this.cartItems.filter(i => 
      i.product.id !== item.id && i.product.id !== item.product?.id
    );
    this.cartSubject.next([...this.cartItems]);
  }
  
  // Update item quantity
  updateItemQuantity(item: any): void {
    const index = this.cartItems.findIndex(i => 
      i.product.id === (item.id || item.product?.id)
    );
    
    if (index >= 0) {
      this.cartItems[index].quantity = item.quantity;
      this.cartSubject.next([...this.cartItems]);
    }
  }
  
  // Clear cart
  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
  }
  
  // Get total price
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + (Number(item.product.price) * item.quantity), 
      0
    );
  }
  
  // Get item count
  getCartCount(): number {
    return this.cartItems.reduce(
      (count, item) => count + item.quantity, 
      0
    );
  }
}
