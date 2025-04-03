'use client'
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Color, Piece } from "chess.js";
import useStore, { States } from "../store";
import Image from "next/image";
import { get_captured_pieces,formatCapturedPieces, calculateMaterial, findPiece } from "../utils/ChessUtils";
import GameHistory from "./GameHistory";
import SettingsButton from "./SettingsButton";
import SettingsModal from "./SettingsModal";
import { ArrowClockwise, ArrowCounterClockwise, DeviceRotate } from "@phosphor-icons/react";
import { BoardOrientation } from "react-chessboard/dist/chessboard/types";

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
    const settings = useStore(state => state.settings);
    // const [color, setColor] = useState("white");
    const [whiteCaptured, setWhiteCaptured] =  useState({p: 0, r: 0, n: 0, b: 0, q: 0, k: 0});
    const [blackCaptured, setBlackCaptured] = useState({p: 0, r: 0, n: 0, b: 0, q: 0, k: 0});
    const [boardStyle, setBoardStyle] = useState<BoardStyle>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [loadedFen, setLoadedFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"); 
    const [loadedIndex, setLoadedIndex] = useState(0);
    const [diff, setDiff] = useState(0);
    const [history, setHistory] = useState<string[]>([]);
    // const [status, setStatus] = useState("white to move"); 
    const [orientation, setOrientation] = useState("white");
    // const [bKing, setBKing] = useState("e8");
    // const [wKing, setWKing] = useState("e1");
    const [inCheck, setInCheck] = useState('none'); 
    const changeBoardStyle = (square: string) => {
        const copyBoardStyle: BoardStyle = {...boardStyle}; 
        copyBoardStyle[square] = { backgroundColor: "#FF424B" };
        setBoardStyle(copyBoardStyle);
    }
    const restart =() => { 
        setLoadedFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        setLoadedIndex(0);
        setGame(new Chess());
        setWhiteCaptured({p: 0, r: 0, n: 0, b: 0, q: 0, k: 0});
        setBlackCaptured({p: 0, r: 0, n: 0, b: 0, q: 0, k: 0});
        setBoardStyle({});
        setDiff(0);
        setHistory([]);
        // setStatus("white to move");
        setInCheck('none');
    }
    useEffect(() => { 
        console.log("loaded fen", loadedFen)
        const moves = game.history({verbose: true});
        console.log(moves)
        const selectedMove = moves[loadedIndex-1];
        console.log(loadedIndex)
        console.log(selectedMove)
        const selectedFen = selectedMove ? selectedMove.after : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        console.log(selectedFen)
        const selectedSpecificNotation = [selectedMove?.from, selectedMove?.to]
        setLoadedFen(selectedFen);
        let copyBoardStyle: BoardStyle = {};
        copyBoardStyle[selectedSpecificNotation[0]] = { backgroundColor: "#CFD17B" };
        copyBoardStyle[selectedSpecificNotation[1]] = { backgroundColor: "#ACA249" };
        setBoardStyle(copyBoardStyle);

    }, [loadedIndex])
    
    const makeMove = (move: Move) => {
        if (game.fen() !== loadedFen) { 
            console.log(game.fen())
            console.log(loadedFen)
            // alert("can not make moves while looking at game history")
            return null; 
        }
        const result = game.move(move);
        let copyHistory = [...history];
        
        if (result) {
            copyHistory.push(game.history()[game.history().length - 1]);
            const color = game.turn() === "w" ? "white" : "black";
            
            const newWhiteCaptured = get_captured_pieces(game, "white", whiteCaptured);
            const newBlackCaptured = get_captured_pieces(game, "black", blackCaptured);
            
            // let copyBoardStyle: BoardStyle = {
            //     [result.from]: { backgroundColor: "#CFD17B" }, 
            //     [result.to]: { backgroundColor: "#ACA249" }
            // };
            let copyBoardStyle: BoardStyle = {}; 
            
            let newStatus = `${color} to move`;
            let newInCheck = 'none';
            
            if (game.inCheck()) {
                newInCheck = color === "black" ? "black" : "white";
                const position = findPiece(game, 'k', color[0] as Color)[0] as string;
                copyBoardStyle[position] = {backgroundColor: "#FF424B"};
                newStatus = color === "black" ? "Black is in check" : "White is in check";
            }
            
            if (game.isGameOver()) {
                if (game.isCheckmate()) {
                    newStatus = color === "black" ? "White wins" : "Black wins";
                } else if (game.isStalemate()) {
                    newStatus = "Stalemate";
                } else if (game.isInsufficientMaterial()) {
                    newStatus = "Insufficient material";
                } else if (game.isThreefoldRepetition()) {
                    newStatus = "Threefold repetition";
                }
            }
            setLoadedFen(game.fen());
            setLoadedIndex(game.history().length);
            setGame(game);
            setWhiteCaptured(newWhiteCaptured);
            setBlackCaptured(newBlackCaptured);
            setDiff(calculateMaterial(newWhiteCaptured) - calculateMaterial(newBlackCaptured));
            // setStatus( newStatus);
            setInCheck(newInCheck);
            setHistory(copyHistory);
            setBoardStyle(copyBoardStyle);
            console.log(game.history({verbose: true}))
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
            {/* <h1 className="text-foreground">{game.history().length}</h1> */}
            {modalOpen && <SettingsModal modalOpen={modalOpen} setModalOpen={setModalOpen}/>}
            <div className={`flex ${settings.switchOrientation ? (game.turn() === "w" ? "flex-col" : "flex-col-reverse") : orientation == "white" ? "flex-col" : "flex-col-reverse"} gap-3 justify-center items-center w-1/2 h-full`}>
                <div className="flex flex-row gap-2 justify-between items-center w-full px-2">
                  <div className="flex flex-row justify-center items-start gap-2">
                    <Image src="https://ui-avatars.com/api/?size=32&name=B" alt="black" width={32} height={32}/>
                    <span className="text-foreground">Black</span>
                  </div>
                  <span className="text-foreground text-xl">{formatCapturedPieces(whiteCaptured)} {diff > 0 ? `+${diff}` : ""} </span>
                </div>
                
                <Chessboard
                    position={loadedFen}
                    onPieceDrop={onDrop}
                    // boardWidth={400}
                    customSquareStyles={boardStyle}
                    boardOrientation={settings.switchOrientation ? (game.turn() === "w" ? "white" : "black") : orientation as BoardOrientation}
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
            <div className="flex flex-col w-1/4 h-full justify-between py-9 items-start">
                <GameHistory  history={history} setSelectedIndex={setLoadedIndex} selectedIndex={loadedIndex}/>
                <div className="flex flex-col gap-4">
                    <button className="text-foreground cursor-pointer disabled:text-red-400" onClick={() => { 
                        // alert("my name is fatty")
                        setLoadedIndex(loadedIndex + 1)
                    }} disabled={loadedIndex == game.history().length}>+</button>
                    <button className="text-foreground cursor-pointer disabled:text-red-400" onClick={() => { 
                        // alert("my name is fatty")
                        setLoadedIndex(loadedIndex - 1)
                    }} disabled={loadedIndex == 0 }>-</button>
                    <button className="text-gray-300 cursor-pointer" onClick={restart}><ArrowCounterClockwise size={20} weight="bold"/></button>
                    <button className="text-gray-300 cursor-pointer" onClick={() => { 
                        if(settings.switchOrientation) { 
                            alert("Manually Switching orientation is disabled when the switch orientation setting is enabled");
                        } else { 
                            setOrientation(orientation === "white" ? "black" : "white");
                        }
                       
                    }}><DeviceRotate size={20} weight="bold"/></button>
                </div>
            </div>
            <SettingsButton modalOpen={modalOpen} setModalOpen={setModalOpen}/>
        </div>
        
    )
}
export default ChessComponent;