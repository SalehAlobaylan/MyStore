import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../modules/product';
import { CartService } from '../services/cart.service';
import { FirstImagePipe } from '../pipes/first-image.pipe';

@Component({
  selector: 'app-product-item-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, FirstImagePipe],
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css'],
})
export class ProductItemDetailComponent implements OnInit {
  product?: Product;
  selectedQuantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productIndex = this.route.snapshot.paramMap.get('id');
    if (productIndex) {
      this.productService.getProducts().subscribe((products) => {
        this.product = products.find((p) => p.index === Number(productIndex));
      });
    }
  }

  addToCart(): void {
    if (this.product) {
      const productWithQuantity = {
        ...this.product,
        quantity: this.selectedQuantity,
      };
      this.cartService.addToCart(productWithQuantity);
    }
  }
}