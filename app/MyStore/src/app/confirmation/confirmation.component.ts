import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckoutForm } from '../modules/checkout-form';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css',
})
export class ConfirmationComponent implements OnInit {
  orderDetails?: CheckoutForm;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.orderDetails = navigation?.extras.state?.['orderDetails'];
  }

  ngOnInit(): void {
    if (!this.orderDetails) {
      this.router.navigate(['/products']);
    }
  }
}

// template: `
// <div class="confirmation">
//   <h2>Order Confirmed!</h2>
//   <p>Thank you for your purchase!</p>
//   <a routerLink="/products">Continue Shopping</a>
// </div>
// `
