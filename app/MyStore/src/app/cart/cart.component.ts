import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { Product } from '../modules/product';
import { FirstImagePipe } from '../pipes/first-image.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, FirstImagePipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  items$: Observable<Product[]>;
  total: number = 0;

  constructor(private cartService: CartService, private router: Router) {
    this.items$ = this.cartService.items$;
  }

  ngOnInit(): void {
    this.items$.subscribe((items) => {
      this.total = items.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );
    });
  }

  updateQuantity(item: Product): void {
    this.cartService.updateItemQuantity(item);
  }

  checkout(): void {
    this.router.navigate(['/confirmation']);
    this.cartService.clearCart();
  }
}
