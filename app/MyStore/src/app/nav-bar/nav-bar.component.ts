import { Component } from '@angular/core';
import {RouterLink} from '@angular/router'

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

}


// template: `
// <nav class="nav-bar">
//   <a routerLink="/products">Products</a>
//   <a routerLink="/cart">Cart</a>
// </nav>
// `,
// styles: [`
// .nav-bar { padding: 10px 20px; background: #f8f9fa; }
// a { margin-right: 15px; text-decoration: none; color: #333; }
// `]