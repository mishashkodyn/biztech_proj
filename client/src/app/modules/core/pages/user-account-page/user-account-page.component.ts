import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-account-page',
  standalone: false,
  templateUrl: './user-account-page.component.html',
  styleUrl: './user-account-page.component.scss'
})
export class UserAccountPageComponent implements OnInit {
  username: string | null = null;

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
     this.username = this.route.snapshot.paramMap.get('username');
  }
}
