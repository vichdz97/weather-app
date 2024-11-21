import { Navigation, Search, Sun } from "lucide-react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

function App() {

	return (
		<div className="flex flex-col items-center">
			<div id="search-container" className="sm:relative md:absolute top-0 right-0 mt-5 md:m-5 flex">
				<Search size={18} strokeWidth={1} color="gray" className="absolute translate-x-1/2 translate-y-1/2" />
				<Input 
					type="text" 
					placeholder="Search" 
					className="pl-8 rounded-lg"
				/>
				<Button className="bg-blue-400 rounded-lg">
					<Search />
				</Button>
			</div>
			<div className="w-[200px] p-5 m-5 flex flex-col items-center text-white bg-blue-400 rounded-2xl">
				<div className="w-3/4 flex items-center justify-evenly">
					<Navigation color="white" fill="white" size={14} />
					<p className="text-xs">MY LOCATION</p>
				</div>
				<h2 className="text-2xl">City Name</h2>
				<h1 className="text-5xl">90&deg;</h1>
				<div id="weather-condition" className="w-1/2 flex items-center justify-evenly text-sm ">
					<p>Sunny</p>
					<Sun />
				</div>
				<div className="w-3/4 flex justify-evenly text-sm">
					<p>H: 100&deg;</p>
					<p>L: 80&deg;</p>
				</div>
			</div>
		</div>
	)
}

export default App;