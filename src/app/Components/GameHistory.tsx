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
const GameHistory = ({ history, selectedIndex, setSelectedIndex }: { history: string[], selectedIndex: number, setSelectedIndex: (index: number) => void }) => {
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
            
            {Object.entries(moveHistory).map(([moveNumber, moves]) => {
                
                return (
                <div key={moveNumber} className="flex flex-row justify-between items-center text-foreground w-full">
                    <span className="font-light text-gray-400">{moveNumber}. </span>
                    <div className="w-1/2 flex flex-row justify-between items-center px-3 font-semibold">
                        <span onClick={() => { 
                            setSelectedIndex((2* Number(moveNumber))-1);
                            
                        }}className={`${(2* Number(moveNumber))-1 ===  history.length || (2* Number(moveNumber))-1 === selectedIndex ? "py-1 px-1 rounded-sm shadow-bottom font-bold" : "cursor-pointer hover:text-red-400"} ${(2* Number(moveNumber))-1 ===  history.length ? "bg-activeBackground" : (2* Number(moveNumber))-1 === selectedIndex ? "bg-activeHistoryNotationBackground" : ""}`}>{formatPrint(moves[0])}</span>
                        {moves[1] && <span onClick={() => { 
                            setSelectedIndex(2* Number(moveNumber));
                        }}className={`${Number(moveNumber) === Object.entries(moveHistory).length || (2* Number(moveNumber)) === selectedIndex ? "py-1 px-1 rounded-sm shadow-bottom font-bold" : "cursor-pointer hover:text-red-400"} ${Number(moveNumber) === Object.entries(moveHistory).length ? "bg-activeBackground" : (2* Number(moveNumber)) === selectedIndex ? "bg-activeHistoryNotationBackground" : ""}`}>{formatPrint(moves[1])}</span>}
                    </div>
                </div> ) }
            )}

            
            
        </div>
    );
}
export default GameHistory;