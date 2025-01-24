import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import CurrentWeatherData from "@/interfaces/WeatherData";
import { Thermometer } from "lucide-react";

interface Props {
    className?: string;
    data: CurrentWeatherData | null;
}

function FeelsLike({ className, data }: Props) {
    return ( data &&
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex gap-1">
                    <Thermometer strokeWidth={1.5} className="-ml-1"/>
                    <span>FEELS LIKE</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl">
                {Math.round(data.main.feels_like)}&deg;
            </CardContent>
            { Math.round(data.main.feels_like) < Math.round(data.main.temp) && (
                <CardFooter>Wind is making it feel colder.</CardFooter>
            )}
        </Card>
    );
}

export default FeelsLike;