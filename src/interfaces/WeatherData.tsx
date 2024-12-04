export default interface WeatherData {
    name: string;
    main: {
        feels_like: number,
        humidity: number,
        grnd_level: number, // pressure
        sea_level: number, // pressure
        temp: number,
        temp_max: number,
        temp_min: number,
    };
    sys: {
        pod: string;
    };
    weather: [{
        main: string;
    }];
    wind: {
        deg: number,
        gust: number,
        speed: number
    };
}