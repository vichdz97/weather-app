import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CurrentWeatherData from "@/interfaces/WeatherData";
import { Gauge } from "lucide-react";

interface Props {
    className?: string;
    data: CurrentWeatherData | null;
}

function Pressure({ className, data }: Props) {
    return ( data &&
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex gap-2">
                    <Gauge strokeWidth={1.5} />
                    <span>PRESSURE</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between gap-1 items-center">
                    <p>Ground Level</p>
                    <p className="flex gap-1">
                        {Math.round(data.main.grnd_level)}
                        <span>hPa</span>
                    </p>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between gap-1 items-center">
                    <p>Sea Level</p>
                    <p className="flex gap-1">
                        {Math.round(data.main.sea_level)}
                        <span>hPa</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default Pressure;