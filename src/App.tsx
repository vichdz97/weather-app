import { Cloud, Search, Thermometer, Wind, Waves, Gauge, CloudRainWind, MoonStar, Sun, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import WeatherData from "./interfaces/WeatherData";
import axios from "axios";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import AppSidebar from "./AppSidebar";

const url = 'http://api.openweathermap.org/data/2.5/forecast';

function App() {
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  	const [location, setLocation] = useState('Dallas');
	const [newLocation, setNewLocation] = useState('');
  	const [units, setUnits] = useState('imperial');
	const [error, setError] = useState('');

	// Fetch weather data for the default location (Dallas)
	useEffect(() => {
		async function fetchWeather() {
			try {
				setError('');
				const response = await axios.get(`${url}?q=${location}&units=${units}&appid=${import.meta.env.VITE_API_KEY}`);
				const data = response.data.list[0];
				setWeatherData(data);
				console.log(data);
			} catch (err: any) {
				setWeatherData(null);
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
        setNewLocation('');
	};

	const setBackgroundGradient = () => {
		const hour = new Date().getHours();
		const condition = weatherData?.weather[0].main;

		// dawn 6AM to 8AM
		if (hour >= 6 && hour < 8)
			return "from-orange-300 to-blue-600 to-90%";
		
		// day 8AM to 6PM
		if (hour >= 8 && hour < 18)
			return (condition == "Rain" || condition == "Clouds") ? "from-slate-600 to-slate-400" : "from-cyan-300 to-blue-600 to-90%";
		
		// dusk 6PM to 8PM
		if (hour >= 18 && hour < 20)
			return "from-orange-300 to-blue-900 to-90%";
		
		// night 8PM to 6AM
		if (hour >= 20 || hour < 6)
			return "from-blue-950/90 to-indigo-950 to-70%";
	}

	const setSearchInputBg = () => {
		const hour = new Date().getHours();
		if (hour >= 18 || hour < 6) // dusk to dawn - 6PM to 6 AM
			return "bg-blue-600/30";
		return "bg-blue-800/30";
	}

	const getWeatherIcon = (condition: string) => {
		switch (condition) {
			case "Clear": 
				if (weatherData?.sys.pod == 'n') return <MoonStar strokeWidth={1.5} />;
				return <Sun strokeWidth={1.5} />
			case "Clouds": return <Cloud strokeWidth={1.5} />;
			case "Rain": return <CloudRainWind strokeWidth={1.5} />;
			default: return;
		}
	}

	return (
		<SidebarProvider defaultOpen={false} className={`overflow-auto bg-gradient-to-t ${setBackgroundGradient()}`}>
			<AppSidebar units={units} setUnits={setUnits}/>
			<SidebarTrigger className="z-10 ml-3 mt-3 text-slate-400 hover:text-slate-400 active:text-slate-100 hover:bg-slate-100/10" />
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
					{ weatherData ? (
						<>
							<h2 className="text-2xl">{location}</h2>
							<h1 className="text-5xl">{Math.round(weatherData.main.temp)}&deg;</h1>
							<div id="weather-condition" className="w-full flex items-center justify-center">
								<p className="mr-2">{weatherData.weather[0].main}</p>
								{ getWeatherIcon(weatherData.weather[0].main) }
							</div>
							<div className="w-3/4 flex justify-evenly">
								<p>H: {Math.round(weatherData.main.temp_max)}&deg;</p>
								<p>L: {Math.round(weatherData.main.temp_min)}&deg;</p>
							</div>
						</>
					) : error ? (
						<p className="text-3xl">&mdash; &mdash;</p>
					) : (
						<p>Loading...</p>
					)}
				</div>

				<div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 text-white text-sm">
					{ weatherData && (
						<>
							<Card className="relative">
								<CardHeader className="p-3 pt-4">
									<CardTitle>
										<Thermometer strokeWidth={1.5} className="mr-1"/>
										<span>FEELS LIKE</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="text-3xl mb-20 sm:mb-4 px-4">
									{Math.round(weatherData.main.feels_like)}&deg;
								</CardContent>
								{ Math.round(weatherData.main.feels_like) < Math.round(weatherData.main.temp) && (
									<CardFooter className="absolute bottom-0 p-4">Wind is making it feel colder.</CardFooter>
								)}
							</Card>
							<Card>
								<CardHeader className="p-4 pb-3">
									<CardTitle>
										<Wind strokeWidth={1.5} className="mr-2"/>
										<span>WIND</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="px-4 pb-4">
									<div className="flex justify-between">
										<p>Wind</p>
										<p>
											{Math.round(weatherData.wind.speed)}
											<span className="ml-1">{units == 'imperial' ? 'mph' : 'm/s'}</span>
										</p>
									</div>
									<hr className="my-3" />
									<div className="flex justify-between">
										<p>Gusts</p>
										<p>
											{Math.round(weatherData.wind.gust)}
											<span className="ml-1">{units == 'imperial' ? 'mph' : 'm/s'}</span>
										</p>
									</div>
									<hr className="my-3" />
									<div className="flex justify-between">
										<p>Direction</p>
										<p>{Math.round(weatherData.wind.deg)}&deg;</p>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="p-4 pb-3">
									<CardTitle>
										<Waves strokeWidth={1.5} className="mr-2" />
										<span>HUMIDITY</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="text-3xl px-4">
									{Math.round(weatherData.main.humidity)}&#37;
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="p-4 pb-3">
									<CardTitle>
										<Gauge strokeWidth={1.5} className="mr-2"/>
										<span>PRESSURE</span>
									</CardTitle>
								</CardHeader>
								<CardContent className="px-4 pb-4">
									<div className="flex justify-between items-center">
										<p>Ground Level</p>
										<p>{Math.round(weatherData.main.grnd_level)}<span className="ml-1">hPa</span></p>
									</div>
									<hr className="my-3" />
									<div className="flex justify-between items-center">
										<p>Sea Level</p>
										<p>{Math.round(weatherData.main.sea_level)}<span className="ml-1">hPa</span></p>
									</div>
								</CardContent>
							</Card>
						</>
					)}
				</div>
			</div>
		</SidebarProvider>
	)
}

export default App;