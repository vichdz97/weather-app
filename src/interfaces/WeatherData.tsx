export default interface WeatherData {
    name: string;
    main: {
        temp: number;
        temp_max: number;
        temp_min: number;
    };
    weather: [{
        description: string;
    }];
}