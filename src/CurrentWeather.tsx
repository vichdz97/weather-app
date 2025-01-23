import { ReactNode } from "react";
import CurrentWeatherData from "./interfaces/WeatherData";

interface Props {
    currentHour: number;
    data: CurrentWeatherData | null;
    error: string;
    location: string;
    getWeatherIcon: (condition: string, hour: number) => ReactNode;
}

function CurrentWeather({ currentHour, data, error, location, getWeatherIcon }: Props) {
    return ( data ? 
        <div className="flex flex-col items-center mt-10 mb-5 md:mt-0">
            <h2 className="text-2xl">{location}</h2>
            <h1 className="text-5xl">{Math.round(data.main.temp)}&deg;</h1>
            <div className="flex gap-1">
                <span>{data.weather[0].main}</span>
                { getWeatherIcon(data.weather[0].main, currentHour) }
            </div>
            <div className="flex gap-2">
                <p className="flex gap-1">
                    <span>H:</span>
                    {Math.round(data.main.temp_max)}&deg;
                </p>
                <p className="flex gap-1">
                    <span>L:</span>
                    {Math.round(data.main.temp_min)}&deg;
                </p>
            </div>
        </div>
        : error ? 
            <p className="text-3xl text-center m-10">&mdash; &mdash;</p> 
            : <p className="text-center m-10">Loading...</p>
    );
}

export default CurrentWeather;