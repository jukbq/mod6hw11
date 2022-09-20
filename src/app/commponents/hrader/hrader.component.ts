import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { faFilm, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROLE } from 'src/app/shared/services/constant/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { LoginResponse } from 'src/app/shared/interfaces/accoumt';
import { OrderResponse } from 'src/app/shared/interfaces/order';

@Component({
  selector: 'app-hrader',
  templateUrl: './hrader.component.html',
  styleUrls: ['./hrader.component.scss']
})
export class HraderComponent implements OnInit {


  public summ = 0;
  public count = 0;

  public activeClass = true;
  public basket: Array<GoodsResponse> = [];
  public trashIcon = faTrash;
  public isLogin = false;
  public loginUrl = '';


  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addToBasket()
    this.updateBasket()
    this.changeUserUrl()
    this.updatesUserLogin()
  }

  active() {
    this.activeClass
  }




  quantity_goods(goods: GoodsResponse, value: boolean): void {
    if (value) {
      ++goods.count
      this.editBasket(goods, value)
    } else if (!value && goods.count > 1) {
      --goods.count
      this.editBasket(goods, value)
    }

  }

  addToBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
      this.summPrice()
    }
  }

  summPrice(): void {
    this.summ = this.basket.reduce((summ: number, good: GoodsResponse) =>
      summ + good.count * good.price, 0)
    this.count = this.basket.reduce((count: number, goods: GoodsResponse) =>
      count + goods.count, 0)
  }


  editBasket(good: any, value: boolean) {
    let basket: Array<GoodsResponse> = []
    basket = JSON.parse(localStorage.getItem('basket') as string);
    let index = basket.findIndex(index => index.id === good.id)
    if (basket.some(good => good.id === good.id)) {
      if (value) {
        basket[index].count += 1;
      } if (!value) {
        basket[index].count -= 1;
      }
    }
    else {
      basket.push(good);

    }
    localStorage.setItem('basket', JSON.stringify(basket))
    this.orderService.chageBasket.next(true)
  }

  delOrder(order: any) {
    let basket: Array<GoodsResponse> = [];
    basket = JSON.parse(localStorage.getItem('basket') as string);
    console.log(basket);
    let index = basket.findIndex(index => index.id === order.id);
    basket.splice(index, 1);
    localStorage.setItem('basket', JSON.stringify(basket))
    this.orderService.chageBasket.next(true)


  }

  addOrder(order: any) : void {
    let login = JSON.parse(localStorage.getItem('login') as string);
    let addOrder = {
      id: 0,
      login: login.fullName,
      email: login.email,
      phone: login.role,
      order: {
        name: order.name,
        count: order.count,
        price: order.price,
        images: order.images
      }
    }
    addOrder.order = order
    console.log(addOrder);
    console.log(order);
    this.orderService.addOrder(addOrder).subscribe(() => {
      this.router.navigate(['']);
      localStorage.removeItem('basket');
     
    })
 this.updateBasket()
  }



  changeUserUrl() {
    const courentUser = JSON.parse(localStorage.getItem('login') as string);
    if (courentUser && courentUser.role == ROLE.ADMIN) {
      this.isLogin = true
      this.loginUrl = 'admin'
    } else if (courentUser && courentUser.role == ROLE.USER) {
      this.isLogin = true
      this.loginUrl = 'user-cabinet'

    } else {
      this.isLogin = false
      this.loginUrl = ' '

    }
  }




  updateBasket(): void {
    this.orderService.chageBasket.subscribe(() =>
      this.addToBasket()
    )
  }

  updatesUserLogin(): void {
    this.accountService.isUserLogin$.subscribe(() => {
      this.changeUserUrl();
    })
  }


}
