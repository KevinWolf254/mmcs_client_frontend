import { Injectable } from '@angular/core';
import { Country } from '../../models/employer.model';

@Injectable()
export class CountryService {
  
  private countries = [
    {id: Country.RWANDA, name: 'Rwanda', countryCode: "+250", acronym:'RWF'},
    {id: Country.KENYA, name: 'Kenya', countryCode: "+254", acronym:'KES'},
    {id: Country.TANZANIA, name: 'Tanzania', countryCode: "+255", acronym:'TZS'},
    {id: Country.UGANDA, name: 'Uganda', countryCode: "+256", acronym:'UGX'}
  ];
  constructor() { }

  public getCountries(): any[]{
    return this.countries;
  }
  
  public convertCountryAsString(country: Country): string{
    if(country == Country.RWANDA)
      return "RWANDA";
    else if(country == Country.KENYA)
      return "KENYA";
    else if(country == Country.TANZANIA)
      return "TANZANIA";
    else
      return "UGANDA";
  }
}
