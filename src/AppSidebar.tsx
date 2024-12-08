import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "./components/ui/sidebar";

interface Props {
	units: string;
	setUnits: (unit: string) => void;
}

function AppSidebar({ units, setUnits } : Props) {

	const moveSwitch = () => {
		return units == 'imperial' && 'translate-x-full';
	}

    return(
      	<Sidebar>
        	<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Units</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className="relative flex items-center h-9 w-full p-1 rounded bg-blue-500/40 text-slate-100">
							<div className={`h-7 w-1/2 cursor-pointer rounded-md bg-blue-600 transition duration-300 ${moveSwitch()}`}></div>
							<span className="absolute left-0 w-1/2 h-full flex items-center justify-center cursor-pointer" onClick={() => setUnits('metric')}>
								Metric: &deg;C
							</span>
							<span className="absolute right-0 w-1/2 h-full flex items-center justify-center cursor-pointer" onClick={() => setUnits('imperial')}>
								Imperial: &deg;F
							</span>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
        	</SidebarContent>
      	</Sidebar>
    );
}

export default AppSidebar;