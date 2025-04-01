'use client'
import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Color, Piece } from "chess.js";
import useStore, { States } from "../store";
import Image from "next/image";
import { get_captured_pieces,formatCapturedPieces, calculateMaterial, findPiece } from "../utils/ChessUtils";
import GameHistory from "./GameHistory";

// import { useEffect } from "react";
type Move = { 
    from: string;
    to: string;
    promotion?: string;
}
type BoardStyle = {
    [key: string]: {[key: string] : string};
}
const characters = { 
    "p": "♟",
    "r": "♜",
    "n": "♞",
    "b": "♝",
    "q": "♛",
    "k": "♚",
}
const ChessComponent = () => { 
    // const [game, setGame] = useState(new Chess());
    const game = useStore(state => state.game);
    const setGame = useStore(state => state.setGame);
    // const [color, setColor] = useState("white");
    const [whiteCaptured, setWhiteCaptured] =  useState({p: 0, r: 0, n: 0, b: 0, q: 0, k: 0});
    const [blackCaptured, setBlackCaptured] = useState({p: 0, r: 0, n: 0, b: 0, q: 0, k: 0});
    const [boardStyle, setBoardStyle] = useState<BoardStyle>({});
    const [diff, setDiff] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    const [status, setStatus] = useState("white to move"); 
    // const [bKing, setBKing] = useState("e8");
    // const [wKing, setWKing] = useState("e1");
    const [inCheck, setInCheck] = useState('none'); 
    const changeBoardStyle = (square: string) => {
        const copyBoardStyle: BoardStyle = {...boardStyle}; 
        copyBoardStyle[square] = { backgroundColor: "#FF424B" };
        setBoardStyle(copyBoardStyle);
    }
    const changeBoardStyleToDefault = (piece: string, square: string) => {
        console.log(square, piece) 
        let copyBoardStyle: BoardStyle = {...boardStyle};
        console.log(JSON.stringify(copyBoardStyle))
        // // Check if the square has the red highlighting from dragging
        // if (copyBoardStyle[square]?.backgroundColor === "#FF424B") {
        //     // If this is a king in check, keep it highlighted red
        //     const isKingInCheck = 
        //         (inCheck !== 'none') && 
        //         (square === findPiece(game, 'k', inCheck[0] as Color)[0]);
                
        //     if (isKingInCheck) {
        //         // Keep the red highlighting for a king in check
        //         return;
        //     }
            
        //     // For last move highlighting (yellow/brown)
        //     const isFromLastMove = 
        //         Object.entries(copyBoardStyle).some(([key, style]) => 
        //             key === square && 
        //             (style.backgroundColor === "#CFD17B" || style.backgroundColor === "#ACA249")
        //         );
                
        //     if (isFromLastMove) {
        //         // Preserve the last move highlighting
        //         return;
        //     }
            
        //     // Otherwise, remove the highlighting
        //     delete copyBoardStyle[square];
        //     setBoardStyle(copyBoardStyle);
        // }
    }
    const makeMove = (move: Move) => {
        
        const copyGame = new Chess(game.fen());
        const result = copyGame.move(move);
        let copyHistory = [...history];
        if (result) {
            // console.log(copyGame.history())
            copyHistory.push(copyGame.history()[0]);
            const color = copyGame.turn() === "w" ? "white" : "black";
            
           
            const newWhiteCaptured = get_captured_pieces(copyGame, "white", whiteCaptured);
            const newBlackCaptured = get_captured_pieces(copyGame, "black", blackCaptured);
            
          
            let copyBoardStyle: BoardStyle = {
                [result.from]: { backgroundColor: "#CFD17B" }, 
                [result.to]: { backgroundColor: "#ACA249" }
            };
            
           
            let newStatus = `${color} to move`;
            let newInCheck = 'none';
            
            if (copyGame.inCheck()) {
                newInCheck = color === "black" ? "black" : "white";
                const position = findPiece(copyGame, 'k', color[0] as Color)[0] as string;
                copyBoardStyle[position] = {backgroundColor: "#FF424B"};
                newStatus = color === "black" ? "Black is in check" : "White is in check";
            }
            
            if (copyGame.isGameOver()) {
                if (copyGame.isCheckmate()) {
                    newStatus = color === "black" ? "White wins" : "Black wins";
                } else if (copyGame.isStalemate()) {
                    newStatus = "Stalemate";
                } else if (copyGame.isInsufficientMaterial()) {
                    newStatus = "Insufficient material";
                } else if (copyGame.isThreefoldRepetition()) {
                    newStatus = "Threefold repetition";
                }
            }
            
            
            setGame(copyGame);
            setWhiteCaptured(newWhiteCaptured);
            setBlackCaptured(newBlackCaptured);
            setDiff(calculateMaterial(newWhiteCaptured) - calculateMaterial(newBlackCaptured));
            setStatus(newStatus);
            setInCheck(newInCheck);
            setHistory(copyHistory);
            setBoardStyle(copyBoardStyle);
        }
        
        return result;
    }

    function onDrop(sourceSquare: string, targetSquare: string) {
        const move = makeMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });
        if (move === null) return false;
        // setGame(game);
        return true;
    }
    return ( 
        <div className="flex w-full flex-row gap-4 justify-center items-start  h-full py-6">
            <div className="flex flex-col gap-3 justify-center items-center w-1/2 h-full">
                <div className="flex flex-row gap-2 justify-between items-center w-full px-2">
                  <div className="flex flex-row justify-center items-start gap-2">
                    <Image src="https://ui-avatars.com/api/?size=32&name=B" alt="black" width={32} height={32}/>
                    <span className="text-foreground">Black</span>
                  </div>
                  <span className="text-foreground text-xl">{formatCapturedPieces(whiteCaptured)} {diff > 0 ? `+${diff}` : ""} </span>
                </div>
                
                <Chessboard
                    position={game.fen()}
                    onPieceDrop={onDrop}
                    // boardWidth={400}
                    customSquareStyles={boardStyle}
                    // onPieceDragBegin={(piece, sourceSquare) => { 
                    //     changeBoardStyle(sourceSquare)
                    // }}
                    // onPieceDragEnd={(piece, sourceSquare) => {
                    //     changeBoardStyleToDefault(piece, sourceSquare)
                    // }}
                    />


                
                <div className="flex flex-row gap-2 justify-between items-center w-full px-2">
                  <div className="flex flex-row justify-center items-start gap-2">
                    <Image src="https://ui-avatars.com/api/?size=32&name=W" alt="white" width={32} height={32}/>
                    <span className="text-foreground">White</span>
                  </div>
                  <span className="text-foreground text-xl">{formatCapturedPieces(blackCaptured)} {diff < 0 ? `+${diff * -1}` : ""}</span>
                </div>
            </div>
            <GameHistory  history={history} />
                
        </div>
        
    )
}
export default ChessComponent;