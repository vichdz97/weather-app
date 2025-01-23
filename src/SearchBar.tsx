import { CircleX, Search } from "lucide-react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

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
    const setSearchInputBg = () => {
		// dusk to dawn - 6PM to 6 AM
		return (timeOfDay.isDusk || timeOfDay.isNight) ? "bg-blue-600/30" : "bg-blue-800/30";
	}

    return (
        <div className="hidden md:flex md:absolute md:top-0 md:right-0 md:m-5">
			<Search size={18} strokeWidth={1} className="absolute translate-x-1/2 translate-y-1/2 text-slate-300" />
            <Input 
                type="text" 
                placeholder="Search"
                className={`pl-8 rounded-lg border-none focus-visible:ring-4 focus-visible:ring-blue-500 placeholder:text-slate-300 caret-blue-500 ${setSearchInputBg()}`}
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
    );
}

export default SearchBar;