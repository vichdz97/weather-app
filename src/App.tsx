import { Search, Thermometer, Wind, Waves, Gauge, Cloud } from "lucide-react";
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
		<div className="flex flex-col items-center bg-gradient-to-t from-cyan-300 to-blue-600 to-90%">
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
						<div id="weather-condition" className="w-full flex items-center justify-center">
							<p className="mr-2">{weatherData.weather[0].main}</p>
							<Cloud strokeWidth={1} />
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
						<div className="flex flex-col relative p-3 rounded-lg bg-blue-600/30">
							<div className="flex items-center mb-3">
								<Thermometer strokeWidth={1.5} className="mr-1" />
								<span>FEELS LIKE</span>
							</div>
							<h3 className="text-2xl">{Math.round(weatherData.main.feels_like)}&deg;</h3>
							{ Math.round(weatherData.main.feels_like) < Math.round(weatherData.main.temp) ? (
								<p className="absolute bottom-0 mr-3 mb-3">Wind is making it feel colder.</p>
							) : null}
						</div>
						<div className="p-3 rounded-lg bg-blue-600/30">
							<div className="flex items-center mb-3">
								<Wind strokeWidth={1.5} className="mr-2" />
								<span>WIND</span>
							</div>
							<div className="flex justify-between">
								<p>Wind</p>
								<p>{Math.round(weatherData.wind.speed)} mph</p>
							</div>
							<hr className="my-3" />
							<div className="flex justify-between">
								<p>Gusts</p>
								<p>{Math.round(weatherData.wind.gust)} mph</p>
							</div>
							<hr className="my-3" />
							<div className="flex justify-between">
								<p>Direction</p>
								<p>{Math.round(weatherData.wind.deg)}&deg;</p>
							</div>
						</div>
						<div className="p-3 rounded-lg bg-blue-600/30">
							<div className="flex items-center mb-3">
								<Waves strokeWidth={1.5} className="mr-2" />
								<span>HUMIDITY</span>
							</div>
							<h3 className="text-2xl">{Math.round(weatherData.main.humidity)}&#37;</h3>
						</div>
						<div className="p-3 rounded-lg bg-blue-600/30">
							<div className="flex items-center mb-3">
								<Gauge strokeWidth={1.5} className="mr-2" />
								<span>PRESSURE</span>
							</div>
							<div className="flex justify-between">
								<p>Ground Level</p>
								<p>{Math.round(weatherData.main.grnd_level)} hPa</p>
							</div>
							<hr className="my-3" />
							<div className="flex justify-between">
								<p>Sea Level</p>
								<p>{Math.round(weatherData.main.sea_level)} hPa</p>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default App;