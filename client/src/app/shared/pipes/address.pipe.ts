import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  /*transform(value?: ConfirmationToken['shipping'], ...args: unknown[]): unknown {
    if(value?.address && value.name)
    {
      const {line1,line2,city,country,state,postal_code} = value.address;
      return `${value.name}, ${line1}${line2 ? ', ' + line2 : ''}, ${city}, ${state}, ${postal_code}, ${country}`;
    }
    else
    {
      return 'unknown address'
    }
  }*/

  transform(value: any): string {
  if (!value) return 'unknown address';

  // Stripe tipi
  if (value.address && value.name) {
    const { name, address: a } = value;
    const { line1, line2, city, state, postal_code, country } = a;
    return `${name}, ${line1}${line2 ? ', ' + line2 : ''}, ${city}, ${state}, ${postal_code}, ${country}`;
  }

  // Kendi Order modelin
  if (value.line1 && value.name) {
    const { name, line1, line2, city, state, postalCode, country } = value;
    return `${name}, ${line1}${line2 ? ', ' + line2 : ''}, ${city}, ${state}, ${postalCode}, ${country}`;
  }

  return 'unknown address';
}

}
