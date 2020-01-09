import { Component, OnInit, NgZone } from '@angular/core';
import { CityService } from '../services/city.service';
import { MapsAPILoader } from '@agm/core';
import { forkJoin } from 'rxjs';
import {debounceTime} from 'rxjs/operators';
declare var google: any;
@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit {
  
  selectedState = 0;
  geocoder:any;
  public location = {
    lat: 20.5937,
    lng: 78.9629,
    marker: {
      lat: 51.678418,
      lng: 7.809007,
      draggable: true
    },
    zoom: 7,
    viewport:0
  };
  arrayMap = [];
  stateList = [];
  cityList: any;
  markerList: any[] = [];
  selectedCityList: any = [];
  constructor(private cityService: CityService) {}
 

  ngOnInit() {
    this.getAllServices();
  }

  getAllServices() {
    this.cityService.getAllCities().subscribe((response: any) => {
      this.cityList = response;
      this.getStatesList();
      console.log('City List', this.cityList);
    });
  }

  getStatesList() {
    
    this.cityList.forEach((ele)=>{
      if(this.stateList.length){
        let index = this.stateList.findIndex(o => o.toLowerCase() == ele.State.toLowerCase());
        if(index === -1) {
          this.stateList.push(ele.State);
        }
      } else {
        this.stateList.push(ele.State);
      }     
    });
    console.log('Temp State List', this.stateList);
  }

  getCity(state) {
    let tempCityList = [];
    tempCityList = this.cityList.filter(ele=> ele.State.toLowerCase() === state.toLowerCase());
    this.selectedCityList = tempCityList;
    console.log(tempCityList);

    // this.findLocation(' '+tempCityList[0].City);
    let geoLocationCalls = [];
    this.getLatLongForState(state);
    tempCityList.forEach((ele) => {
      let address = ele.City + ' ' + ele.District + ' ' + ele.State;
      geoLocationCalls.push(this.cityService.getLatAnLong(address));
    //  this.getLatLong(address);
     
    });

    forkJoin(...geoLocationCalls).pipe(debounceTime(500)).subscribe(
      data => {
        var a = (data);  
        console.log('geo location array',data);
        let resultArray = [];
        data.map((ele) =>{
          if(ele.results.length) {
            let merkerObj = {
              lat: ele.results[0].geometry.location.lat,
              lng:  ele.results[0].geometry.location.lng,
            }
            resultArray.push(merkerObj);
          }         
        });  
        this.markerList =   resultArray;
        console.log('array',resultArray);
      }, err => console.log('error ' + err),
      () => console.log('Ok ')
    );
  }

  getLatLongForState(state) {
    this.cityService.getLatAnLong(state).subscribe((response:any) => {
      this.location.lat = response.results[0].geometry.location.lat;
      this.location.lng = response.results[0].geometry.location.lng;
    });
  } 

}
