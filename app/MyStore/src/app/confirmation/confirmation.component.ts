import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {

}

// template: `
// <div class="confirmation">
//   <h2>Order Confirmed!</h2>
//   <p>Thank you for your purchase!</p>
//   <a routerLink="/products">Continue Shopping</a>
// </div>
// `