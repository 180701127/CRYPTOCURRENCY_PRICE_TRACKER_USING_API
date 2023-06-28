import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ViewChild } from '@angular/core';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {
  coinData:any;
  coinId!: string;
  days: number=1;
  currency:string="INR";
  chart: any;
  public lineChartData:ChartConfiguration['data']={
    datasets:[
      {
        data:[],
        label:'Price Trends',
        backgroundColor:'rgba(148,170,177,0.2)',
        borderColor:'#009688',
        pointBackgroundColor:'#009688',
        pointBorderColor:'#009688',
        pointHoverBackgroundColor:'#009688',
        pointHoverBorderColor:'#009688'
      }
    ],
    labels:[]
 };
  public lineChartOptions:ChartConfiguration['options']={
   elements:{
    point:{
     radius:1
    }
   },

  plugins:{
  legend:{
   display:true
  },
 }
 };
 public lineChartType: ChartType = 'line';
 @ViewChild(BaseChartDirective) mylineChart !: BaseChartDirective;
  constructor(private api: ApiService,private activatedRoute:ActivatedRoute,private currencyService : CurrencyService){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val=>{
      this.coinId=val['id'];
    });
    this.getcoinData();
    this.getGraphicalData(this.days);
    
    this.currencyService.getCurrency().subscribe(val=>{
      this.currency = val;
      this.getGraphicalData(this.days);
      this.getcoinData();
    });
  }
    
  getcoinData(){
    this.api.getCurrencybyId(this.coinId).subscribe(res=>{
      this.coinData=res;
      
      console.log(this.coinData);
      if(this.currency==="USD")
      {
        res.market_data.current_price.inr = res.market_data.current_price.usd
        res.market_data.market_cap.inr = res.market_data.market_cap.usd
      }
      res.market_data.current_price.inr = res.market_data.current_price.usd
      res.market_data.market_cap.inr = res.market_data.market_cap.usd
      this.coinData=res;
    })

  }

  getGraphicalData(days:number){
   this.api.getGraphicalData(this.coinId,this.currency,1).subscribe(res=>{
      setTimeout(()=>{
        this.mylineChart.chart?.update();
      },400);
      this.lineChartData.datasets[0].data=res.prices.map((a:any)=>{
        return a[1];
      });
      this.lineChartData.labels = res.prices.map((a:any)=>{
        let date = new Date(a[0]);
        let time = date.getHours() > 12?
        `${date.getHours()-12}:${date.getMinutes()} PM` :
        `${date.getHours()}:${date.getMinutes()} AM`
        return this.days === 1 ? time:date.toLocaleDateString();
      })
    })
  }

}