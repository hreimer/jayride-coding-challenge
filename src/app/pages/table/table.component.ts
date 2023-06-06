import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


export interface TravelOption {
  name: string;
  vehicleType: Vehicle;
  pricePerPassenger: number;
}

export interface Vehicle {
  name: string;
  maxPassengers: number;
}
@Component({
  selector: 'jr-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit {
  @ViewChild(MatSort) sort = new MatSort();

  constructor(private apiService: ApiService) {}
 
  public dataSource = new MatTableDataSource<TravelOption>();
  displayedColumns: string[] = ['name', 'vehicleType', 'pricePerPassenger'];
  nrOfPassengers = 3;
  totalCountListings = 0;
  averagePrice = 0;
  minPrice = 0
  maxPrice = 0; 

  ngAfterViewInit(): void {
    this.apiService.getTravelOptionsData().pipe(
      // if the sorting etc would not be client-side, then server side pagination, sort etc would have to be implemented, meaning modifying the request object / filter optiosn that are sent to the server to get a subset of the data, and not 1000000000 entries -> improves performance for the good old mat-table as well when less rows have to be handled
      // tap(data => console.log(JSON.stringify(data)))
    ).subscribe(data => {
      // console.log(data);
      const dataSource = this.dataSource;

      this.totalCountListings = data.listings.length;
      
      // find the average, minimum and maximum price (across all listings, not just the ones that are displayed in the table)
      this.findMinMaxAndAverage(data.listings);
      // can do it also this way instead of using the for loop
      // this.minPrice = data.listings.reduce((min: number, b: TravelOption) => Math.min(min, b.pricePerPassenger), data.listings[0].pricePerPassenger);
      // this.maxPrice = data.listings.reduce((max: number, b: TravelOption) => Math.max(max, b.pricePerPassenger), data.listings[0].pricePerPassenger);
      // average price can also be calculated with reduce
      // this.averagePrice = this.getAveragePrice(data.listings);


      dataSource.data = data.listings.filter((elm: TravelOption) => {
        return elm.vehicleType.maxPassengers >= this.nrOfPassengers;
      })
      if (this.sort) // check it sort is defined.
      {
        // first take care of nested sort properties
        this.dataSource.sortingDataAccessor = this.pathDataAccessor;
        // apply sort function to table
        this.dataSource.sort = this.sort;
        // here could also be assigning of pagination
      }
    })
  }

  // these functions below could go into a general helperService if they are used throughout the app and shared with other components through a shared module - I would abstract them and put them in a service, making the component script and template cleaner

  // this function allows using nested sorting paths like found in vehicleType.name
  pathDataAccessor(item: any, path: string): any {
    return path.split('.')
      .reduce((accumulator: any, key: string) => {
        return accumulator ? accumulator[key] : undefined;
      }, item);
  }

  getAveragePrice(listings: TravelOption[]): number {
    const avg = listings.reduce((r, c) => r + c.pricePerPassenger, 0) / listings.length;
    return avg;
  }

  // calculate min, max and average in 1 loop instead of using reduce, map, filter etc across multiple loops
  findMinMaxAndAverage(arr: TravelOption[]) {
    let sum = 0;
    let min = arr[0].pricePerPassenger, max = arr[0].pricePerPassenger;
  
    for (let i = 1, len=arr.length; i < len; i++) {
      sum += arr[i].pricePerPassenger;
      let v = arr[i].pricePerPassenger;
      min = (v < min) ? v : min;
      max = (v > max) ? v : max;
    }

    const avg = sum/arr.length;
  
    this.averagePrice = avg;
    this.minPrice = min;
    this.maxPrice = max;
  }
}
