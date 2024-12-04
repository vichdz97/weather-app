export default interface WeatherData {
    name: string;
    main: {
        temp: number,
        feels_like: number,
        temp_max: number,
        temp_min: number,
    };
    weather: [{
        main: string;
    }];
}