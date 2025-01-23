import { Cloud, Search, CloudRainWind, MoonStar, Sun, CircleX, CloudFog, CloudMoon, CloudMoonRain, Snowflake, CloudDrizzle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import AppSidebar from "./AppSidebar";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

import CurrentWeatherData from "./interfaces/WeatherData";
import ForecastWeatherData from "./interfaces/WeatherData";

import ForecastHour from "./widgets/ForecastHour";
import FeelsLike from "./widgets/FeelsLike";
import WindInfo from "./widgets/WindInfo";
import Humidity from "./widgets/Humidity";
import Pressure from "./widgets/Pressure";
import Sunset from "./widgets/Sunset";
import Sunrise from "./widgets/Sunrise";

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
				if (dawn || day) return <Sun fill="gold" stroke="gold" strokeWidth={1.5} />;
				else return <MoonStar fill="white" strokeWidth={1.5} />;
			case "Clouds": return night ? <CloudMoon fill="white" strokeWidth={1.5} /> : <Cloud fill="white" strokeWidth={1.5} />;
			case "Drizzle": return <CloudDrizzle strokeWidth={1.5} />;
			case "Fog":
			case "Haze":
			case "Mist": return <CloudFog strokeWidth={1.5} />;
			case "Rain": return night ? <CloudMoonRain strokeWidth={1.5} /> : <CloudRainWind strokeWidth={1.5} />;
			case "Snow": return <Snowflake strokeWidth={1.5} />;
			default: return;
		}
	}

	const getTime = (time: number) => {
		return timeFormat == 12 ? 
			new Date(time * 1000).toLocaleTimeString().replace(/:\d*\s/g, " ") 
			:
			new Date(time * 1000).toTimeString().replace(/:\d*\s.*/g, "");
	}

	return (
		<SidebarProvider defaultOpen={false} className={`overflow-auto bg-gradient-to-t ${setBackgroundGradient()}`}>
			<AppSidebar 
				units={units} timeFormat={timeFormat} newLocation={newLocation} 
				setUnits={setUnits} setTimeFormat={setTimeFormat} setNewLocation={setNewLocation}
				handleSearch={handleSearch}
			 />
			<SidebarTrigger className="z-10 ml-3 mt-3 text-slate-300 hover:text-slate-300 active:text-slate-100 hover:bg-slate-100/10" />
			<div className="w-full flex flex-col items-center -ml-10">
				<div className="hidden md:flex md:absolute md:top-0 md:right-0 md:m-5">
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
					<ForecastHour className="col-span-2 md:col-start-2"
						currentHour={currentHour}
						currentData={currentWeatherData}
						forecastData={forecastWeatherData}
						getTime={getTime}
						getWeatherIcon={getWeatherIcon}
					/>
					<FeelsLike className="md:row-start-1 md:col-start-1" data={currentWeatherData} />
					<WindInfo data={currentWeatherData} units={units} />
					<Humidity data={currentWeatherData} />
					<Pressure data={currentWeatherData} />
					{ isDawn || isDay ? 
						<Sunset data={currentWeatherData} getTime={getTime} />
						:
						<Sunrise data={currentWeatherData} getTime={getTime} />
					}
				</div>
			</div>
		</SidebarProvider>
	);
}

export default App;