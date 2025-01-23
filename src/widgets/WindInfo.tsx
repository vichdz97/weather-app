import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CurrentWeatherData from "@/interfaces/WeatherData";
import { Wind } from "lucide-react";

interface Props {
    className?: string;
    data: CurrentWeatherData | null;
    units: string
}

function WindInfo({ className, data, units }: Props) {
    const getWindDirection = (direction: number): string => {
        const directions = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW", "N"]
        const index = Math.round((direction % 360) / 22.5);
        return directions[index];
    }

    return ( data &&
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex gap-2">
                    <Wind strokeWidth={1.5} />
                    <span>WIND</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between">
                    <p>Wind</p>
                    <p className="flex gap-1">
                        {Math.round(data.wind.speed)}
                        <span>{units == 'imperial' ? 'mph' : 'm/s'}</span>
                    </p>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between">
                    <p>Gusts</p>
                    <p className="flex gap-1">
                        {Math.round(data.wind.gust) || 0}
                        <span >{units == 'imperial' ? 'mph' : 'm/s'}</span>
                    </p>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between">
                    <p>Direction</p>
                    <p className="flex gap-1">
                        {data.wind.deg}°
                        <span>{getWindDirection(data.wind.deg)}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default WindInfo;