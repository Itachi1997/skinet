import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket, IBasketItem } from '../../models/Basket';

@Component({
  selector: 'app-basketsummary',
  templateUrl: './basketsummary.component.html',
  styleUrls: ['./basketsummary.component.scss']
})
export class BasketsummaryComponent implements OnInit {
  basket$: Observable<IBasket>;

  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Input() isBasket = true;


  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  decrementItemQuantity(item: IBasketItem){
    this.decrement.emit(item);
  }
  incrementItemQuantity(item: IBasketItem){
    this.increment.emit(item);
  }
  removeBasketItem(item: IBasketItem){
    this.remove.emit(item);
  }

}
