import { CircleX, Search } from "lucide-react";
import { Input } from "./components/ui/input";

interface Props {
    timeOfDay: {
        isDusk: boolean,
        isNight: boolean
    };
    newLocation: string;
    setNewLocation: (loc: string) => void;
    handleSearch: () => void;
}

function SearchBar({ timeOfDay, newLocation, setNewLocation, handleSearch }: Props) {
    const setBackground = () => {
		// dusk to dawn - 6PM to 6 AM
		return (timeOfDay.isDusk || timeOfDay.isNight) ? "bg-blue-600/30" : "bg-blue-800/30";
	}

    return (
        <>
			<Search size={18} strokeWidth={1} className="absolute translate-x-1/2 text-slate-300 cursor-text" />
            <Input 
                type="text" 
                placeholder="Search"
                className={`px-8 border-none rounded-xl text-slate-100 caret-blue-500 placeholder:text-slate-300 focus-visible:ring-4 focus-visible:ring-blue-500/50 ${setBackground()}`}
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyUp={(e) => newLocation && e.key == "Enter" && handleSearch()}
            />
            <CircleX 
                size={18} 
                strokeWidth={1} 
                className="absolute right-0 -translate-x-1/2 cursor-pointer fill-slate-300 stroke-slate-500 active:fill-slate-300"
                visibility={newLocation == '' ? 'hidden' : 'visible'}
                onClick={() => setNewLocation('')}
            />
        </>
    );
}

export default SearchBar;