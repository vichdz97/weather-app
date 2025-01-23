import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CurrentWeatherData from "@/interfaces/WeatherData";
import { SunriseIcon } from "lucide-react";

interface Props {
    className?: string;
    data: CurrentWeatherData | null;
    getTime: (time: number) => string;
}

function Sunrise({ className, data, getTime }: Props) {
    return ( data &&
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex gap-2">
                    <SunriseIcon strokeWidth={1.5} />
                    <span>SUNRISE</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl">
                {getTime(data.sys.sunrise)}
            </CardContent>
            <CardFooter className="flex gap-1">
                <span>Sunset:</span>
                {getTime(data.sys.sunset)}
            </CardFooter>
        </Card>
    );
}

export default Sunrise;