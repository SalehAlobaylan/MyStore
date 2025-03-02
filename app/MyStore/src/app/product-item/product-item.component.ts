import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../modules/product';
import { CartService } from '../services/cart.service';
import { FirstImagePipe } from '../pipes/first-image.pipe';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FirstImagePipe],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css',
})
export class ProductItemComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();

  selectedQuantity: number = 1;
  showNotification = false;
  notificationMessage = '';

  constructor(private cartService: CartService) {}

  // addToCart(): void {
  //   const productWithQuantity = {
  //     ...this.product,
  //     quantity: this.selectedQuantity,
  //   };
  //   this.cartService.addToCart(productWithQuantity);
  //   this.showNotification = true;
  //   this.notificationMessage = `Added ${this.selectedQuantity} ${this.product.name}(s) to cart`;

  //   setTimeout(() => {
  //     this.showNotification = false;
  //   }, 3000);
  // }

onAddToCart() {
  this.addToCart.emit({
    product: this.product,
    quantity: this.selectedQuantity
  });

      this.showNotification = true;
    this.notificationMessage = `Added ${this.selectedQuantity} ${this.product.name}(s) to cart`;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
}
}
