import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../modules/product';
import { CartService } from '../services/cart.service';
import { FirstImagePipe } from '../pipes/first-image.pipe';
import { ProductItemComponent } from '../product-item/product-item.component';


@Component({
  selector: 'app-product-item-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, FirstImagePipe, ProductItemComponent],
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css'],
})
export class ProductItemDetailComponent implements OnInit { 
  // product?: Product;

  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<{ product: Product; quantity: number }>();


  selectedQuantity: number = 1;
  showNotification = false;
  notificationMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productIndex = this.route.snapshot.paramMap.get('id');
    if (productIndex) {
      this.productService.getProducts().subscribe((products) => {
        const foundProduct = products.find((p) => p.index === Number(productIndex));
        if (foundProduct) {
          this.product = foundProduct;
        } else {
          console.error('Product not found');
        }
      });
    }
  }

  // addToCart(): void {
  //   if (this.product) {
  //     const productWithQuantity = {
  //       ...this.product,
  //       quantity: this.selectedQuantity,
  //     };
  //     this.cartService.addToCart(productWithQuantity);
  //     this.showNotification = true;
  //     this.notificationMessage = `Added ${this.selectedQuantity} ${this.product.name}(s) to cart`;

  //   setTimeout(() => {
  //     this.showNotification = false;
  //   }, 3000);
  //   }
  // }

  onAddToCart(): void {
    if (this.product) {
      const productWithQuantity = {
        ...this.product,
        quantity: this.selectedQuantity
      };
      this.cartService.addToCart(productWithQuantity);

      this.showNotification = true;
      this.notificationMessage = `Added ${this.selectedQuantity} ${this.product.name}(s) to cart`;

      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    }
  }

  
}
