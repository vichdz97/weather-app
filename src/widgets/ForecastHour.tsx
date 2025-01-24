import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CurrentWeatherData from "@/interfaces/WeatherData";
import ForecastWeatherData from "@/interfaces/WeatherData";
import { Clock, Sunrise, Sunset } from "lucide-react";

interface Props {
    className?: string;
    currentData: CurrentWeatherData | null;
    forecastData: ForecastWeatherData | null;
    getTime: (time: number) => string;
    getWeatherIcon: (condition: string, hour: number) => ReactNode;
}

interface WeatherData {
    time: string;
    icon: ReactNode;
    temp: string;
}

function ForecastHour({ className, currentData, forecastData, getTime, getWeatherIcon }: Props) {
    const [weatherData, setWeatherData] = useState<Array<WeatherData>>([]);

    useEffect(() => {
        if (currentData && forecastData) {
            const tempArr = [currentData, ...forecastData.list.slice(0, 10)];
            const sunrise = get24HourTime(currentData.sys.sunrise);
            const sunset = get24HourTime(currentData.sys.sunset);

            let forecastArr: Array<WeatherData> = [];
            for (let i = 0; i < tempArr.length - 1; i++) {
                forecastArr.push({
                    time: getTime(tempArr[i].dt).replace(":00 ", ""),
                    icon: getWeatherIcon(tempArr[i].weather[0].main, parseInt(get24HourTime(tempArr[i].dt))),
                    temp: `${Math.round(tempArr[i].main.temp).toString()}°`
                });

                const timeBefore = get24HourTime(tempArr[i].dt);
                const timeAfter = get24HourTime(tempArr[i + 1].dt);
                if (sunrise > timeBefore && sunrise < timeAfter) {
                    forecastArr.push({
                        time: getTime(currentData.sys.sunrise).replace(" ", ""),
                        icon: <Sunrise fill="gold" strokeWidth={1.5} />,
                        temp: "Sunrise"
                    });
                }
                if (sunset > timeBefore && sunset < timeAfter) {
                    forecastArr.push({
                        time: getTime(currentData.sys.sunset).replace(" ", ""),
                        icon: <Sunset fill="orange" strokeWidth={1.5} />,
                        temp: "Sunset"
                    });
                }
            }

            setWeatherData(forecastArr);
        }

    }, [currentData, forecastData]);

    const get24HourTime = (time: number) => {
        return new Date(time * 1000).toTimeString().replace(/:.*/g, "");
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex gap-2">
                    <Clock strokeWidth={1.5} />
                    <span>24-HR FORECAST</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between gap-4 overflow-scroll font-semibold">
                { weatherData.map((data: WeatherData, index: number) => {
                    return (
                        <div key={index} className="flex-1 min-w-12 flex flex-col items-center gap-4">
                            <span>{index == 0 ? "Now" : data.time}</span>
                            {data.icon}
                            <span>{data.temp}</span>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

export default ForecastHour;