'use client'
// import { Move } from "chess.js";
import { useEffect, useState } from "react";
type MoveHistory = { 
    [key: number]: string[];
}
const GameHistory = ({ history }: { history: string[] }) => {
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
    return (
        <div className="flex flex-col gap-3 w-1/4 bg-secondaryBackground p-4 rounded h-1/2 overflow-auto mt-9"> 
          
            {Object.entries(moveHistory).map(([moveNumber, moves]) => (
                <div key={moveNumber} className="flex flex-row justify-between items-center text-foreground w-full">
                    <span className="font-light text-gray-400">{moveNumber}. </span>
                    <div className="w-1/2 flex flex-row justify-between items-center px-3 font-semibold">
                        <span className={`${moves[1] ? "" : "bg-activeBackground py-1 px-1 rounded-sm shadow-bottom font-bold"}`}>{moves[0]}</span>
                        {moves[1] && <span className={`${Number(moveNumber) === Object.entries(moveHistory).length ? "bg-activeBackground py-1 px-1 rounded-sm shadow-bottom font-bold" : ""}`}>{moves[1]}</span>}
                    </div>
                </div>
            ))}
            
        </div>
    );
}
export default GameHistory;