import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'card',
  standalone: true
})
export class CardPipe implements PipeTransform {

  /* transform(value?: ConfirmationToken['payment_method_preview'], ...args: unknown[]): unknown {
     if(value?.card)
       {
         const {brand, last4, exp_month, exp_year} = value.card;
 
         return `${brand.toUpperCase()} **** **** **** ${last4}, Exp: ${exp_month}/${exp_year}`;
 
       }
       else
       {
         return 'unknown card'
       }
   }*/

  transform(value?: any): string {

    if(!value) return 'unknown card';

    if (value.card) {
      const { brand, last4, exp_month, exp_year } = value.card;

      return `${brand.toUpperCase()} **** **** **** ${last4}, Exp: ${exp_month}/${exp_year}`;
    }
    if (value.last4)
    {
      const { brand, last4, expMonth, expYear } = value;
      return `${brand.toUpperCase()} **** **** **** ${last4}, Exp: ${expMonth}/${expYear}`;
    }
    return 'unknown card'

  }

}
