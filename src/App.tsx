import { Cloudy, Search, Thermometer, Wind, Waves, Gauge, CloudRainWind, MoonStar, Sun, CircleX, Sunrise, Sunset, CloudFog, CloudMoon, CloudMoonRain, Snowflake, CloudDrizzle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import CurrentWeatherData from "./interfaces/WeatherData";
import ForecastWeatherData from "./interfaces/WeatherData";
import axios from "axios";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import AppSidebar from "./AppSidebar";

const currentWeatherURL = 'http://api.openweathermap.org/data/2.5/weather';
const forecastURL = 'http://api.openweathermap.org/data/2.5/forecast';

const currentHour = new Date().getHours();
const isDawn = currentHour >= 6 && currentHour < 8;
const isDay = currentHour >= 8 && currentHour < 18;
const isDusk = currentHour >= 18 && currentHour < 20;
const isNight = currentHour >= 20 || currentHour < 6;

function App() {
	const [currentWeatherData, setCurrentWeatherData] = useState<CurrentWeatherData | null>(null);
	const [forecastWeatherData, setForecastWeatherData] = useState<ForecastWeatherData | null>(null);
  	const [location, setLocation] = useState('Dallas');
	const [newLocation, setNewLocation] = useState('');
  	const [units, setUnits] = useState('imperial');
  	const [timeFormat, setTimeFormat] = useState(12);
	const [error, setError] = useState('');

	// Fetch weather data for the default location (Dallas)
	useEffect(() => {
		async function fetchWeather() {
			try {
				setError('');
				const currentResponse = await axios.get(`${currentWeatherURL}?q=${location}&units=${units}&appid=${import.meta.env.VITE_API_KEY}`);
				const currentData = currentResponse.data;
				// console.log("currentData", currentData);
				setCurrentWeatherData(currentData);

				const forecastResponse = await axios.get(`${forecastURL}?q=${location}&units=${units}&appid=${import.meta.env.VITE_API_KEY}`);
				const forecastData = forecastResponse.data;
				console.log("forecastData", forecastData);
				setForecastWeatherData(forecastData);
			} catch (err: any) {
				setCurrentWeatherData(null);
				setForecastWeatherData(null);
				setError(err.respon?.data?.message || err.message);
				console.error('There was an error fetching weather data!', err);
			}
		}

		fetchWeather();
	}, [location, units]);

	const formatLocation = (location: string): string => {
		return location
			.trim()
			.split(/\s+/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	};

	const handleSearch = () => {
		// Format location
		const formattedLocation = formatLocation(newLocation);
        setLocation(formattedLocation);
        setNewLocation(formattedLocation);
	};

	const setBackgroundGradient = () => {
		const condition = currentWeatherData?.weather[0].main;

		// dawn 6AM to 8AM
		if (isDawn)
			return "from-orange-300 to-blue-600 to-90%";
		
		// day 8AM to 6PM
		if (isDay)
			return (condition == "Rain" || condition == "Clouds") ? "from-slate-600 to-slate-400" : "from-cyan-300 to-blue-600 to-90%";
		
		// dusk 6PM to 8PM
		if (isDusk)
			return "from-orange-300 to-blue-900 to-90%";
		
		// night 8PM to 6AM
		if (isNight)
			return "from-blue-950/90 to-indigo-950 to-70%";
	}

	const setSearchInputBg = () => {
		// dusk to dawn - 6PM to 6 AM
		return (isDusk || isNight) ? "bg-blue-600/30" : "bg-blue-800/30";
	}

	const getWeatherIcon = (condition: string, timeOfDay: number) => {
		const dawn = timeOfDay >= 6 && timeOfDay < 8;
		const day = timeOfDay >= 8 && timeOfDay < 18;
		const dusk = timeOfDay >= 18 && timeOfDay < 20;
		const night = timeOfDay >= 20 || timeOfDay < 6;

		switch (condition) {
			case "Clear":
				if (dawn || day) return <Sun strokeWidth={1.5} />;
				else return <MoonStar strokeWidth={1.5} />;
			case "Clouds": return night ? <CloudMoon strokeWidth={1.5} /> : <Cloudy strokeWidth={1.5} />;
			case "Drizzle": return <CloudDrizzle strokeWidth={1.5} />;
			case "Fog":
			case "Haze":
			case "Mist": return <CloudFog strokeWidth={1.5} />;
			case "Rain": return night ? <CloudMoonRain strokeWidth={1.5} /> : <CloudRainWind strokeWidth={1.5} />;
			case "Snow": return <Snowflake strokeWidth={1.5} />;
			default: return;
		}
	}

	const getWindDirection = (direction: number): string => {
		const directions = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW", "N"]
		const index = Math.round((direction % 360) / 22.5);
		return directions[index];
	}

	const getTime = (time: number) => {
		return timeFormat == 12 ? 
			new Date(time * 1000).toLocaleTimeString().replace(/:\d*\s/g, " ") 
			:
			new Date(time * 1000).toTimeString().replace(/:\d*\s.*/g, "");
	}

	return (
		<SidebarProvider defaultOpen={false} className={`overflow-auto bg-gradient-to-t ${setBackgroundGradient()}`}>
			<AppSidebar units={units} timeFormat={timeFormat} setUnits={setUnits} setTimeFormat={setTimeFormat}/>
			<SidebarTrigger className="z-10 ml-3 mt-3 text-slate-300 hover:text-slate-300 active:text-slate-100 hover:bg-slate-100/10" />
			<div className="w-full flex flex-col items-center -ml-10">
				<div id="search-container" className="flex relative mt-5 md:absolute md:top-0 md:right-0 md:m-5">
					<Search size={18} strokeWidth={1} className="absolute translate-x-1/2 translate-y-1/2 text-slate-300" />
					<Input 
						type="text" 
						placeholder="Search"
						className={`pl-8 rounded-lg border-none focus-visible:ring-4 focus-visible:ring-blue-500 placeholder:text-slate-300 caret-blue-500 text-white ${setSearchInputBg()}`}
						value={newLocation}
						onChange={(e) => setNewLocation(e.target.value)}
					/>
					<CircleX 
						size={18} 
						strokeWidth={1} 
						className="absolute translate-x-1/2 translate-y-1/2 right-16 fill-slate-300 stroke-slate-500 active:fill-slate-300"
						visibility={newLocation == '' ? 'hidden' : 'visible'}
						onClick={() => setNewLocation('')}
					/>
					<Button onClick={handleSearch} className="bg-blue-400 rounded-lg">
						<Search />
					</Button>
				</div>

				<div className="w-[200px] p-5 m-5 flex flex-col items-center text-white">
					{ currentWeatherData ? (
						<>
							<h2 className="text-2xl">{location}</h2>
							<h1 className="text-5xl">{Math.round(currentWeatherData.main.temp)}&deg;</h1>
							<div id="weather-condition" className="w-full flex items-center justify-center">
								<p className="mr-2">{currentWeatherData.weather[0].main}</p>
								{ getWeatherIcon(currentWeatherData.weather[0].main, currentHour) }
							</div>
							<div className="w-3/4 flex justify-evenly">
								<p>H: {Math.round(currentWeatherData.main.temp_max)}&deg;</p>
								<p>L: {Math.round(currentWeatherData.main.temp_min)}&deg;</p>
							</div>
						</>
					) : error ? (
						<p className="text-3xl">&mdash; &mdash;</p>
					) : (
						<p>Loading...</p>
					)}
				</div>

				<div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-white text-sm">
					{ currentWeatherData && forecastWeatherData && (
						<>
							<Card className="col-span-2 md:col-start-2">
								<CardHeader>
									<CardTitle className="flex gap-2">
										<Clock strokeWidth={1.5} />
										<span>24-HR FORECAST</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="flex gap-4 overflow-scroll">
									<div className="flex-1 min-w-10 flex flex-col items-center gap-4 font-semibold">
										<span>Now</span>
										{getWeatherIcon(currentWeatherData.weather[0].main, currentHour)}
										<span>{Math.round(currentWeatherData.main.temp)}&deg;</span>
									</div>
									{ forecastWeatherData?.list.map((data: any, index: number) => {
										return index <= 8 && (
											<>
												<div className="flex-1 min-w-10 flex flex-col items-center gap-4 font-semibold">
													<span>{getTime(data.dt).replace(":00 ", "")}</span>
													{getWeatherIcon(data.weather[0].main, parseInt(new Date(data.dt * 1000).toTimeString().replace(/:.*/g, "")))}
													<span>{Math.round(data.main.temp)}&deg;</span>
												</div>
												{ currentWeatherData.sys.sunrise > data.dt && currentWeatherData.sys.sunrise < forecastWeatherData?.list[index + 1].dt &&
													<div className="flex-1 min-w-10 flex flex-col items-center gap-4 mx-2 font-semibold">
														<span>{getTime(currentWeatherData.sys.sunrise).replace(" ", "")}</span>
														<Sunrise strokeWidth={1.5} />
														<span>Sunrise</span>
													</div>
												}
												{ currentWeatherData.sys.sunset > data.dt && currentWeatherData.sys.sunset < forecastWeatherData?.list[index + 1].dt &&
													<div className="flex-1 min-w-10 flex flex-col items-center gap-4 mx-2 font-semibold">
														<span>{getTime(currentWeatherData.sys.sunset).replace(" ", "")}</span>
														<Sunset strokeWidth={1.5} />
														<span>Sunset</span>
													</div>
												}
											</>
										)
									})}
								</CardContent>
							</Card>
							<Card className="relative md:row-start-1 md:col-start-1">
								<CardHeader>
									<CardTitle className="flex gap-1">
										<Thermometer strokeWidth={1.5} className="-ml-1"/>
										<span>FEELS LIKE</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="text-3xl">
									{Math.round(currentWeatherData.main.feels_like)}&deg;
								</CardContent>
								{ Math.round(currentWeatherData.main.feels_like) < Math.round(currentWeatherData.main.temp) && (
									<CardFooter className="absolute bottom-0">Wind is making it feel colder.</CardFooter>
								)}
							</Card>
							<Card>
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
											{Math.round(currentWeatherData.wind.speed)}
											<span>{units == 'imperial' ? 'mph' : 'm/s'}</span>
										</p>
									</div>
									<Separator className="my-3" />
									<div className="flex justify-between">
										<p>Gusts</p>
										<p className="flex gap-1">
											{Math.round(currentWeatherData.wind.gust) || 0}
											<span >{units == 'imperial' ? 'mph' : 'm/s'}</span>
										</p>
									</div>
									<Separator className="my-3" />
									<div className="flex justify-between">
										<p>Direction</p>
										<p className="flex gap-1">
											{currentWeatherData.wind.deg}°
											<span>{getWindDirection(currentWeatherData.wind.deg)}</span>
										</p>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2">
										<Waves strokeWidth={1.5} />
										<span>HUMIDITY</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="text-3xl">
									{Math.round(currentWeatherData.main.humidity)}&#37;
								</CardContent>
							</Card>
							<Card>
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
											{Math.round(currentWeatherData.main.grnd_level)}
											<span>hPa</span>
										</p>
									</div>
									<Separator className="my-3" />
									<div className="flex justify-between gap-1 items-center">
										<p>Sea Level</p>
										<p className="flex gap-1">
											{Math.round(currentWeatherData.main.sea_level)}
											<span>hPa</span>
										</p>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle className="flex gap-2">
										{ isDawn || isDay ? (
											<>
												<Sunset strokeWidth={1.5} />
												<span>SUNSET</span>
											</>
										) : (
											<>
												<Sunrise strokeWidth={1.5} />
												<span>SUNRISE</span>
											</>
										)}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-3xl">
									{ isDawn || isDay ? getTime(currentWeatherData.sys.sunset) : getTime(currentWeatherData.sys.sunrise)}
								</CardContent>
								<CardFooter className="flex gap-1">
									{ isDawn || isDay ? (
										<>
											<span>Sunrise:</span>
											{getTime(currentWeatherData.sys.sunrise)}
										</>
									) : (
										<>
											<span>Sunset:</span>
											{getTime(currentWeatherData.sys.sunset)}
										</>
									) }
								</CardFooter>
							</Card>
						</>
					)}
				</div>
			</div>
		</SidebarProvider>
	)
}

export default App;