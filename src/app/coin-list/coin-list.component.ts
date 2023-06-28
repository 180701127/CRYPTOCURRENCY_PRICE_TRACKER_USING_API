import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit {
  bannerdata:any=[];
  currency:string="INR"
  dataSource!: MatTableDataSource<any>;
  displayedColumns:string[] = ['symbol','current_price','price_change_percentage_24h','market_cap'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService,private router: Router,private currencyService: CurrencyService){}

  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();
    this.currencyService.getCurrency().subscribe(val=>{
      this.currency=val;
      this.getAllData();
      this.getBannerData();

    })
    
  }

  getBannerData(){
    this.api.getTrendingCurrency(this.currency).subscribe(res=>{
      console.log(res);
      this.bannerdata = res;
    })

  }
  getAllData(){
    this.api.getCurrency(this.currency).subscribe(res=>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  GoToDetails(row:any){
    this.router.navigate(['coin-details',row.id])

  }
  
}
