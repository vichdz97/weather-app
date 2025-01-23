import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CurrentWeatherData from "@/interfaces/WeatherData";
import { Waves } from "lucide-react";

interface Props {
    className?: string;
    data: CurrentWeatherData | null;
}

function Humidity({ className, data }: Props) {
    return ( data &&
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex gap-2">
                    <Waves strokeWidth={1.5} />
                    <span>HUMIDITY</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl">
                {Math.round(data.main.humidity)}&#37;
            </CardContent>
        </Card>
    );
}

export default Humidity;