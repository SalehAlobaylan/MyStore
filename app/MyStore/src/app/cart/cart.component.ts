import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { Product } from '../modules/product';
import { FirstImagePipe } from '../pipes/first-image.pipe';
import { CheckoutForm } from '../modules/checkout-form';

// Define interface to match cart items structure
interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, FirstImagePipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  // Update type to match what CartService provides
  items$: Observable<CartItem[]>;
  total: number = 0;

  product?: Product;
  showNotification = false;
  notificationMessage = '';

  form: CheckoutForm = {
    fullName: '',
    address: '',
    creditCard: '',
    total: 0,
  };

  constructor(private cartService: CartService, private router: Router) {
    this.items$ = this.cartService.items$;
  }

  ngOnInit(): void {
    // Update to use product property from cart item
    this.items$.subscribe((items) => {
      this.total = items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );
    });
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeItem(item);

    this.showNotification = true;
    this.notificationMessage = `Removed ${item.product.name} from the cart`;

    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  updateQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item);
  }

  async onSubmit(): Promise<void> {
    try {
      const items = await firstValueFrom(this.items$);

      this.form.total = items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
      );

      await this.router.navigate(['/confirmation'], {
        state: { orderDetails: this.form },
      });

      this.cartService.clearCart();
    } catch (error) {
      console.error('Error during submission:', error);
    }
  }
}
