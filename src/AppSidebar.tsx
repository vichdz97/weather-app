import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "./components/ui/sidebar";
import SearchBar from "./SearchBar";

interface Props {
	timeOfDay: {
        isDusk: boolean,
        isNight: boolean
    };
	units: string;
	timeFormat: number;
	newLocation: string;
	setUnits: (unit: string) => void;
	setTimeFormat: (time: number) => void;
	setNewLocation: (location: string) => void;
	handleSearch: () => void;
}

function AppSidebar({ timeOfDay, units, timeFormat, newLocation, setUnits, setTimeFormat, setNewLocation, handleSearch } : Props) {

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
					<SidebarGroupContent className="relative flex items-center">
						<SearchBar timeOfDay={timeOfDay} newLocation={newLocation} setNewLocation={setNewLocation} handleSearch={handleSearch} />
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