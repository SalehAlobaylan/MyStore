import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [/*CartService,*/ NavBarComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  // selector: 'app-header',
  // template: `
  //   <header class="header">
  //     <h1>My Store</h1>
  //     <div class="cart-status">Items in Cart: {{ cartItems }}</div>
  //   </header>
  // `,
  // styles: [`
  //   .header { display: flex; justify-content: space-between; padding: 20px; border-bottom: 1px solid #ccc; }
  // `]
})
export class HeaderComponent {
  cartItems = 0;

  constructor(private cartService: CartService) {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items.length;
    });
  }
}