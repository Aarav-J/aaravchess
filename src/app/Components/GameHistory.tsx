'use client'
// import { Move } from "chess.js";
import { useEffect, useState } from "react";
import useStore from "../store";
import { CaretDoubleLeft, CaretDoubleRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
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
        <div className="flex flex-col gap-3 w-full justify-between  bg-secondaryBackground rounded h-3/4"> 
            <div className="flex flex-col gap-3 w-full justify-start items-center overflow-auto p-4 h-7/8 custom-scrollbar">
                {Object.entries(moveHistory).map(([moveNumber, moves]) => {
                
                return (
                <div key={moveNumber} className="flex flex-row justify-between items-center text-foreground w-full">
                    <span className="font-light text-gray-400">{moveNumber}. </span>
                    <div className="w-1/2 flex flex-row justify-between items-center px-3 font-semibold">
                        <span onClick={() => { 
                            setSelectedIndex((2* Number(moveNumber))-1);
                            
                        }}className={`hover:text-purple ${(2* Number(moveNumber))-1 ===  history.length || (2* Number(moveNumber))-1 === selectedIndex ? "py-1 px-1 rounded-sm shadow-bottom font-bold" : "cursor-pointer"} ${(2* Number(moveNumber))-1 ===  history.length ? "bg-activeBackground" : (2* Number(moveNumber))-1 === selectedIndex ? "bg-activeHistoryNotationBackground" : ""}`}>{formatPrint(moves[0])}</span>
                        {moves[1] && <span onClick={() => { 
                            setSelectedIndex(2* Number(moveNumber));
                        }}className={`hover:text-purple ${Number(moveNumber) === Object.entries(moveHistory).length || (2* Number(moveNumber)) === selectedIndex ? "py-1 px-1 rounded-sm shadow-bottom font-bold" : "cursor-pointer "} ${Number(moveNumber) === Object.entries(moveHistory).length ? "bg-activeBackground" : (2* Number(moveNumber)) === selectedIndex ? "bg-activeHistoryNotationBackground" : ""}`}>{formatPrint(moves[1])}</span>}
                    </div>
                </div> ) }
                )}

            </div>
            <div className="flex flex-row justify-center items-center w-full h-1/8 text-foreground">
                <div className={`${selectedIndex == 0 ? "text-gray-600" : ""} w-1/4 py-4 flex items-center justify-center cursor-pointer`} onClick={() => { 
                    setSelectedIndex(0);
                }}><CaretDoubleLeft size={32} weight="bold"/></div>
                <div className={`${selectedIndex == 0 ? "text-gray-600" : ""} w-1/4 py-4 flex items-center justify-center cursor-pointer`} onClick={() => { 
                    if(selectedIndex > 0) { 
                        setSelectedIndex(selectedIndex - 1);
                    }   
                    
                }}><CaretLeft size={32} weight="bold"/></div>
                <div className={`${selectedIndex == history.length ? "text-gray-600" : ""} w-1/4 py-4 flex items-center justify-center cursor-pointer`} onClick={() => { 
                    if(selectedIndex < history.length){
                        setSelectedIndex(selectedIndex + 1)
                    };
                }}><CaretRight size={32} weight="bold"/></div>
                <div className={`${selectedIndex == history.length ? "text-gray-600" : ""} w-1/4 py-4 flex items-center justify-center cursor-pointer`} onClick={() => { 
                    setSelectedIndex(history.length);
                }}><CaretDoubleRight size={32} weight="bold"/></div>
                {/* <button className="w-1/4"><CaretDoubleLeft size={32} weight="fill"/></button>
                <button className="w-1/4"><CaretLeft size={32} weight="fill"/></button>
                <button className="w-1/4"><CaretRight size={32} weight="fill"/></button>
                <button className="w-1/4"><CaretDoubleRight size={32} weight="fill"/></button> */}
            </div>
            
            
            
        </div>
    );
}
export default GameHistory;