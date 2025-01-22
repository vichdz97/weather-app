import { CircleX, Search } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "./components/ui/sidebar";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

interface Props {
	units: string;
	timeFormat: number;
	newLocation: string;
	setUnits: (unit: string) => void;
	setTimeFormat: (time: number) => void;
	setNewLocation: (location: string) => void;
	handleSearch: () => void;
}

function AppSidebar({ units, timeFormat, newLocation, setUnits, setTimeFormat, setNewLocation, handleSearch } : Props) {

	const moveSwitchFor = (label: string) => {
		switch (label) {
			case "units": return units == 'imperial' && 'translate-x-full';	
			case "time": return timeFormat == 12 && 'translate-x-full';
			default: return;
		}
	}

    return(
      	<Sidebar>
        	<SidebarContent>
				<SidebarGroup className="mt-5 md:hidden">
					<SidebarGroupContent className="flex">
						<Search size={18} strokeWidth={1} className="absolute translate-x-1/2 translate-y-1/2 text-slate-300" />
						<Input 
							type="text" 
							placeholder="Search"
							className={`text-white px-8 rounded-l-xl rounded-r-none border-none bg-blue-500/40 focus-visible:ring-4 focus-visible:ring-blue-500 placeholder:text-slate-300 caret-blue-500`}
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
						<Button onClick={handleSearch} className="bg-blue-600 rounded-l-none rounded-r-xl">
							<Search />
						</Button>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Units</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className="relative h-9 w-full flex items-center p-1 rounded-xl bg-blue-500/40 text-slate-100">
							<div className={`h-7 w-1/2 cursor-pointer rounded-xl bg-blue-600 transition duration-300 ${moveSwitchFor("units")}`}></div>
							<span className="absolute left-0 w-1/2 h-full flex items-center justify-center cursor-pointer" onClick={() => setUnits('metric')}>
								Metric: &deg;C
							</span>
							<span className="absolute right-0 w-1/2 h-full flex items-center justify-center cursor-pointer" onClick={() => setUnits('imperial')}>
								Imperial: &deg;F
							</span>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Time</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className="relative h-9 w-full flex items-center p-1 rounded-xl bg-blue-500/40 text-slate-100">
							<div className={`h-7 w-1/2 cursor-pointer rounded-xl bg-blue-600 transition duration-300 ${moveSwitchFor("time")}`}></div>
							<span className="absolute left-0 w-1/2 h-full flex items-center justify-center cursor-pointer" onClick={() => setTimeFormat(24)}>
								24-hour
							</span>
							<span className="absolute right-0 w-1/2 h-full flex items-center justify-center cursor-pointer" onClick={() => setTimeFormat(12)}>
								12-hour
							</span>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
        	</SidebarContent>
      	</Sidebar>
    );
}

export default AppSidebar;