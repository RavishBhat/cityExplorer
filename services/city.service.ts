import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CityService {
    constructor(private http: HttpClient){}

    getAllCities(): Observable<any> {
        return this.http.get<any>('https://indian-cities-api-nocbegfhqg.now.sh/cities');
    }

    getLatAnLong(City): Observable<any> {
        let url  = `https://maps.googleapis.com/maps/api/geocode/json?address=${City}&key=AIzaSyBOruXBp5FYcSUWs7cIn2vGaFgNS68-7Lk`
        return this.http.get<any>(url);
    }
}