import { Cloud, Search } from "lucide-react";
import { useEffect, useState } from "react";
import WeatherData from "./interfaces/WeatherData";
import axios from "axios";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

const apiKey = 'e1dc67815f36dcc0e87dec2028704d37';
const url = 'http://api.openweathermap.org/data/2.5/forecast';

function App() {
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  	const [location, setLocation] = useState('Dallas');
	const [error, setError] = useState('');

	// Fetch weather data for the default location (Dallas)
	useEffect(() => {
		async function fetchWeather() {
			try {
				setError('');
				const response = await axios.get(`${url}?q=${location}&units=imperial&appid=${apiKey}`);
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
	}, [location]);

	const [newLocation, setNewLocation] = useState('');

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

	return (
		<div className="flex flex-col items-center bg-gradient-to-t from-cyan-300 to-blue-600">
		{/* <div className="flex flex-col items-center bg-gradient-to-t from-orange-300 to-blue-900 to-90%"> */}
			<div id="search-container" className="sm:relative md:absolute top-0 right-0 mt-5 md:m-5 flex">
				<Search size={18} strokeWidth={1} className="absolute translate-x-1/2 translate-y-1/2 text-slate-300" />
				<Input 
					type="text" 
					placeholder="Search"
					className="pl-8 rounded-lg border-none focus-visible:ring-4 focus-visible:ring-blue-500 placeholder:text-slate-300 caret-blue-500 text-white bg-blue-800" 
					value={newLocation}
					onChange={(e) => setNewLocation(e.target.value)}
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
						<div id="weather-condition" className="w-full flex items-center justify-center text-sm ">
							<p className="mr-2">{weatherData.weather[0].main}</p>
							<Cloud strokeWidth={1} />
						</div>
						<div className="w-3/4 flex justify-evenly text-sm">
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
		</div>
	)
}

export default App;