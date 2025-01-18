export default interface CurrentWeatherData {
    main: {
        feels_like: number;
        humidity: number;
        grnd_level: number; // pressure
        sea_level: number; // pressure
        temp: number;
        temp_max: number;
        temp_min: number;
    };
    name: string;
    sys: {
        sunrise: number;
        sunset: number;
    };
    weather: [{
        main: string; // weather condition
    }];
    wind: {
        deg: number;
        gust: number;
        speed: number;
    };
}

export default interface ForecastWeatherData {

}