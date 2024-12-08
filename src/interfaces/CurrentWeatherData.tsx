export default interface CurrentWeatherData {
    name: string;
    main: {
        feels_like: number;
        humidity: number;
        grnd_level: number; // pressure
        sea_level: number; // pressure
        temp: number;
        temp_max: number;
        temp_min: number;
    };
    sys: {
        sunrise: string;
        sunset: string
    };
    weather: [{
        main: string; // weather condition
    }];
    wind: {
        deg: number;
        speed: number;
    };
}