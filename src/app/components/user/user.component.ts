import { Component } from '@angular/core';
import { Router } from '@angular/router';


const LIST = [
  { name: 'Особисті дані', link: 'personal-data' },
  { name: 'Улюблені', link: 'favorites' },
]

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  public list: any[] = LIST;
  public activeItem!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeItem = 'personal-data';
  }


  onSelectItem(link: string): void {
    this.activeItem = link;
    this.router.navigate(['user/' + link])
  }

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('curentUser');
    window.location.href = '/';
  }

}
