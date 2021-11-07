import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  Basket,
  IBasket,
  IBasketItem,
  IBasketTotals,
} from '../shared/models/Basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/products';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.baseUrl;

  private basketSource = new BehaviorSubject<any>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<any>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0;

  constructor(private http: HttpClient) {}

  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping = deliveryMethod.price
    this.calculateTotal();
  }

  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: any) => {
        this.basketSource.next(basket);
        this.calculateTotal();
      })
    );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe(
      (res: any) => {
        this.basketSource.next(res);
        this.calculateTotal();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getCurrentBasket() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasket(item, quantity);
    const basket = this.getCurrentBasket() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasket();
    const foundItemindex = basket.items.findIndex((x: any) => x.id == item.id);
    basket.items[foundItemindex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasket();
    const foundItemindex = basket.items.findIndex((x: any) => x.id == item.id);

    if (basket.items[foundItemindex].quantity > 1) {
      basket.items[foundItemindex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasket();
    if(basket.items.some((x:any) => x.id == item.id)){
      basket.items = basket.items.filter((i:any) => i.id !== item.id );
      if(basket.item.length > 0){
        this.setBasket(basket);
      }
      else{
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(
      () => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket.id') ;
      }
    )
  }

  deleteLocalBasket(id:string){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  private addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = items.findIndex((i) => i.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasket(
    item: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    };
  }

  private calculateTotal() {
    const basket = this.getCurrentBasket();
    const shipping = this.shipping;
    const subtotal = basket.items.reduce(
      (a: number, b: any) => b.price * b.quantity + a,
      0
    );
    const total = subtotal + shipping;
    this.basketTotalSource.next({ shipping, total, subtotal });
  }
}
