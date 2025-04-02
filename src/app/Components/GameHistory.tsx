'use client'
// import { Move } from "chess.js";
import { useEffect, useState } from "react";
import useStore from "../store";
type MoveHistory = { 
    [key: number]: string[];
}
const characters = { 
    "p": "♟",
    "r": "♜",
    "n": "♞",
    "b": "♝",
    "q": "♛",
    "k": "♚",
}
const GameHistory = ({ history }: { history: string[] }) => {
//    const game = useStore(state => state.game); 
//    const history = game.history();
   const [moveHistory, setMoveHistory] = useState<MoveHistory>({});
   const formatMoveHistory = (history: string[]) => {
     let moveNumber = 1
     let formattedHistory: MoveHistory = {};
     for (let i = 0; i < history.length; i++) { 
            if (i % 2 === 0) {
                formattedHistory[moveNumber] = [history[i]];
            } else {
                formattedHistory[moveNumber].push(history[i]);
                moveNumber++;
            }
     }
        return formattedHistory;
   }
    useEffect(() => {
          setMoveHistory(formatMoveHistory(history));
    }, [history]); 

    const formatPrint = (move: string) => { 
        if (move[0] === "N" || move[0] === "B" || move[0] === "R" || move[0] === "Q" || move[0] === "K") { 
            return `${characters[move[0].toLowerCase() as keyof typeof characters]}${move}`;
        } else { 
            return `${move}`
        }
    }
    return (
        <div className="flex flex-col gap-3 w-full bg-secondaryBackground p-4 rounded h-1/2 overflow-auto"> 
          
            {Object.entries(moveHistory).map(([moveNumber, moves]) => (
                <div key={moveNumber} className="flex flex-row justify-between items-center text-foreground w-full">
                    <span className="font-light text-gray-400">{moveNumber}. </span>
                    <div className="w-1/2 flex flex-row justify-between items-center px-3 font-semibold">
                        <span className={`${moves[1] ? "" : "bg-activeBackground py-1 px-1 rounded-sm shadow-bottom font-bold"}`}>{formatPrint(moves[0])}</span>
                        {moves[1] && <span className={`${Number(moveNumber) === Object.entries(moveHistory).length ? "bg-activeBackground py-1 px-1 rounded-sm shadow-bottom font-bold" : ""}`}>{formatPrint(moves[1])}</span>}
                    </div>
                </div>
            ))}
            
        </div>
    );
}
export default GameHistory;