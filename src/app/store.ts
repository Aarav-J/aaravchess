import { Chess } from "chess.js";
import {create} from "zustand"; 
export interface States { 
    game: Chess;
    setGame: (game: Chess) => void;
}
const useStore = create<States>((set) => ({ 
    game: new Chess(), 
    setGame: (game: Chess) => set({game: game}),
}))

export default useStore; 