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
})
export class HeaderComponent {
  cartItems = 0;

  constructor(private cartService: CartService) {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items.length;
    });
  }
}