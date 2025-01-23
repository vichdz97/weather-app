import { Cloud, CloudRainWind, MoonStar, Sun, CloudFog, CloudMoon, CloudMoonRain, Snowflake, CloudDrizzle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import AppSidebar from "./AppSidebar";

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
import CurrentWeather from "./CurrentWeather";
import SearchBar from "./SearchBar";

const currentWeatherURL = 'http://api.openweathermap.org/data/2.5/weather';
const forecastURL = 'http://api.openweathermap.org/data/2.5/forecast';

const currentHour = new Date().getHours();
const timeOfDay = {
	isDawn: currentHour >= 6 && currentHour < 8,
	isDay: currentHour >= 8 && currentHour < 18,
	isDusk: currentHour >= 18 && currentHour < 20,
	isNight: currentHour >= 20 || currentHour < 6
};

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
		const { isDawn, isDay , isDusk, isNight } = timeOfDay;
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
			<div className="w-full -ml-10 text-white">
				<SearchBar timeOfDay={timeOfDay} newLocation={newLocation} setNewLocation={setNewLocation} handleSearch={handleSearch} />
				<CurrentWeather currentHour={currentHour} data={currentWeatherData} error={error} location={location} getWeatherIcon={getWeatherIcon} />
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-sm">
					<ForecastHour className="col-span-2 md:col-start-2" currentHour={currentHour} currentData={currentWeatherData} forecastData={forecastWeatherData} getTime={getTime} getWeatherIcon={getWeatherIcon} />
					<FeelsLike className="md:row-start-1 md:col-start-1" data={currentWeatherData} />
					<WindInfo data={currentWeatherData} units={units} />
					<Humidity data={currentWeatherData} />
					<Pressure data={currentWeatherData} />
					{ timeOfDay.isDawn || timeOfDay.isDay ? <Sunset data={currentWeatherData} getTime={getTime} /> : <Sunrise data={currentWeatherData} getTime={getTime} /> }
				</div>
			</div>
		</SidebarProvider>
	);
}

export default App;