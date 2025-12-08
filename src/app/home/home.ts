

import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  //constructor(private router: Router) {}
  constructor(private router: Router, private route: ActivatedRoute) {}

  navigateTo(path: string) {
    //this.router.navigate([path]);
    this.router.navigate([path], { relativeTo: this.route });
  }
}
