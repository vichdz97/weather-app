import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CurrentWeatherData from "@/interfaces/WeatherData";
import ForecastWeatherData from "@/interfaces/WeatherData";
import { Clock, Sunrise, Sunset } from "lucide-react";

interface Props {
    className?: string;
    currentHour: number;
    currentData: CurrentWeatherData | null;
    forecastData: ForecastWeatherData | null;
    getTime: (time: number) => string;
    getWeatherIcon: (condition: string, hour: number) => ReactNode;
}

function ForecastHour({ className, currentHour, currentData, forecastData, getTime, getWeatherIcon }: Props) {
    return ( currentData && forecastData && 
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex gap-2">
                    <Clock strokeWidth={1.5} />
                    <span>24-HR FORECAST</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between gap-4 overflow-scroll font-semibold">
                <div className="flex-initial min-w-10 flex flex-col items-center gap-4">
                    <span>Now</span>
                    {getWeatherIcon(currentData.weather[0].main, currentHour)}
                    <span>{Math.round(currentData.main.temp)}&deg;</span>
                </div>
                { forecastData.list.map((data: any, index: number) => {
                    return index <= 8 && (
                        <div key={index}>
                            <div className="flex-1 min-w-10 flex flex-col items-center gap-4">
                                <span>{getTime(data.dt).replace(":00 ", "")}</span>
                                {getWeatherIcon(data.weather[0].main, parseInt(new Date(data.dt * 1000).toTimeString().replace(/:.*/g, "")))}
                                <span>{Math.round(data.main.temp)}&deg;</span>
                            </div>
                            { currentData.sys.sunrise > data.dt && currentData.sys.sunrise < forecastData.list[index + 1].dt &&
                                <div className="flex-1 min-w-10 flex flex-col items-center gap-4 mx-2">
                                    <span>{getTime(currentData.sys.sunrise).replace(" ", "")}</span>
                                    <Sunrise fill="gold" strokeWidth={1.5} />
                                    <span>Sunrise</span>
                                </div>
                            }
                            { currentData.sys.sunset > data.dt && currentData.sys.sunset < forecastData.list[index + 1].dt &&
                                <div className="flex-1 min-w-10 flex flex-col items-center gap-4 mx-2">
                                    <span>{getTime(currentData.sys.sunset).replace(" ", "")}</span>
                                    <Sunset fill="gold" strokeWidth={1.5} />
                                    <span>Sunset</span>
                                </div>
                            }
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}

export default ForecastHour;