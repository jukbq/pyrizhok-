import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SignInComponent } from 'src/app/modal/sign-in/sign-in.component';
import { ROLE } from 'src/app/shared/guard/role.constant';
import { DishesResponse } from 'src/app/shared/interfaces/dishes';
import { DishesService } from 'src/app/shared/service/dishes/dishes.service';
import { FavoritesService } from 'src/app/shared/service/favorites/favorites.service';
import { HeaderService } from 'src/app/shared/service/header/header.service';


const TopMenuLIST: any[] = [
  { name: 'Про нас', link: 'about-us' },
  { name: 'Доставка та оплата', link: 'delivery-and-payment' },
  { name: 'Акції', link: 'actions' },
  { name: 'Контакти', link: 'contacts' },
  { name: 'Вакансії', link: 'vacancies' },
];

const bpttomMenuLIST: any[] = [
  { name: 'Головна', link: 'main' },
  { name: 'Рецепти', link: 'recipes' },
  { name: 'Про продукти', link: 'about-products' },
  { name: 'Про кухню', link: 'about-kitchen' },

];


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public topMenu: any[] = TopMenuLIST;
  public bpttomMenu: any[] = bpttomMenuLIST;
  public menuArr: any[] = [];
  public menuLink = 'main';
  public favoritGoods = 0;
  public isLogin = false;
  public loginUrl = '';
  public fullName = '';
  public activeUserMenu = false;
  public favoriteRecipes: string[] = [];

  constructor(
    private meta: Meta,
    private router: Router,
    private dishesService: DishesService,
    private headerService: HeaderService,
    private favoritesService: FavoritesService,
    private el: ElementRef,
    private viewportScroller: ViewportScroller,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.changeUserUrl();
    this.getDishes();
    this.headerService.pageInfo$.subscribe((pageInfo) => {
      this.menuLink = pageInfo.title;
    });

    const customer = JSON.parse(localStorage.getItem('curentUser') as string);

    this.favoritesService.favorites$.subscribe((favorites) => {
      this.favoriteRecipes = favorites;
      this.favoritGoods = this.favoriteRecipes.length;
    });
  }

  // Відстежування події прокрутки вікна
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const headerWrapper =
      this.el.nativeElement.querySelector('.header-wrapper');
    const scrollPosition = window.scrollY;
    const windowWidth = window.innerWidth;

    if (windowWidth > 1240) {
      if (scrollPosition > 0) {
        headerWrapper.style.top = '-65px';
      } else {
        headerWrapper.style.top = '0px';
      }
    }
  }



  // Отримати страв зі служби 
  getDishes() {
    this.dishesService.getAll().subscribe((data) => {
      this.menuArr = data as DishesResponse[];
      this.menuArr.sort((a, b) => a.menuindex - b.menuindex);
    });
  }


  // Вибір пункту меню
  onSelectItem(item: string): void {
    this.menuLink = item;
    this.headerService.emitHeaderClick(item);
    if (item !== 'pizza') {
      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  changeUserUrl() {
    const currentUserString = localStorage.getItem('curentUser');

    if (typeof currentUserString === 'string') {
      const courentUser = JSON.parse(currentUserString);

      if (courentUser && courentUser.role == ROLE.ADMIN) {
        this.isLogin = true;
        this.loginUrl = 'admin';
        this.fullName = `${courentUser.firstName} ${courentUser.lastName}`;
      } else if (courentUser && courentUser.role == ROLE.USER) {
        this.isLogin = true;
        this.loginUrl = 'user';
        this.fullName = `${courentUser.firstName} ${courentUser.lastName}`;
      } else {
        this.isLogin = false;
        this.loginUrl = ' ';
        this.fullName = '';
      }
    }
  }

  activeMenu() {
    if (this.loginUrl === 'admin') {
      this.router.navigate(['admin']);
    } else {
      this.activeUserMenu = !this.activeUserMenu;
    }
  }

  // Перезавантаження сторінки
  reload() {
    window.location.href = '/';
  }

  sighInModal(): void {
    let sighIn = this.dialog.open(SignInComponent, {
      panelClass: 'sigh_maoa_dialog',
    });
    console.log(sighIn);

    sighIn.afterClosed().subscribe(() => {
      this.changeUserUrl();
    });
  }

  closrUserMenu() {
    this.activeUserMenu = false;
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('curentUser');
    window.location.href = '/';
  }

  userFav() {
    if (this.isLogin === true) {
      console.log('user', this.isLogin);

      this.router.navigate(['/user/favorite']);
    } else {
      console.log('user', this.isLogin);
      this.router.navigate(['/']);
    }
  }


  // Анімація активного стану гамбургера
  hamburger_active() {
    const headerTop = this.el.nativeElement.querySelector('.header-top');
    const headerMenuList = this.el.nativeElement.querySelector('.menu-list');
    const hamburgerInner =
      this.el.nativeElement.querySelector('.hamburger-inner');

    if (hamburgerInner) {
      headerTop.classList.toggle('active');
      headerMenuList.classList.toggle('active');
      hamburgerInner.classList.toggle('active');
    }
  }

}
