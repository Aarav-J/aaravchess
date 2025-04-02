import { Chess } from "chess.js";
import {create} from "zustand"; 
export interface States { 
    game: Chess;
    setGame: (game: Chess) => void;
    settings: { 
        [key: string]: any;
    };
    setSettings: (settings: { [key: string]: any }) => void;
}
const useStore = create<States>((set) => ({ 
    game: new Chess(), 
    setGame: (game: Chess) => set({game: game}),
    settings: { 
        switchOrientation: false, 
    }, 
    setSettings: (settings: { [key: string]: any }) => set({settings: settings})
}))

export default useStore; 