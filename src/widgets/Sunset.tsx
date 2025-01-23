import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import CurrentWeatherData from "@/interfaces/WeatherData";
import { SunsetIcon } from "lucide-react";

interface Props {
    className?: string;
    data: CurrentWeatherData | null;
    getTime: (time: number) => string;
}

function Sunset({ className, data, getTime }: Props) {
    return ( data &&
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex gap-2">
                    <SunsetIcon strokeWidth={1.5} />
                    <span>SUNSET</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl">
                {getTime(data.sys.sunset)}
            </CardContent>
            <CardFooter className="flex gap-1">
                <span>Sunrise:</span>
                {getTime(data.sys.sunrise)}
            </CardFooter>
        </Card>
    );
}

export default Sunset;