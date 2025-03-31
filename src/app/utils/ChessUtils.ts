import { Chess, Color, PieceSymbol, Square } from "chess.js";

type ChessPiece = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';

export const get_captured_pieces = (game: Chess, color: 'white' | 'black', captured: Record<ChessPiece, number>) => { 
    // const captured: Record<ChessPiece, number> = {'p': 0, 'r': 0, 'n': 0, 'b': 0, 'q': 0, 'k': 0};
    const history = game.history({verbose: true});
    const colorChar = color === 'white' ? 'b' : 'w'; // If we're white, we capture black pieces and vice versa
    
    for (const move of history) { 
        if (move.captured && move.color === colorChar) { 
            captured[move.captured as ChessPiece] += 1;
        }
    }
    return captured;
}
export const formatCapturedPieces = (captured: Record<ChessPiece, number>) => {
    
    return Object.entries(captured).map(([piece, count]) => {
        return `${piece.toUpperCase().repeat(count)}`;
    }).join('');
}

export const calculateMaterial = (captured: Record<ChessPiece, number>) => {
    const materialValues: Record<ChessPiece, number> = {
        'p': 1,
        'r': 5,
        'n': 3,
        'b': 3,
        'q': 9,
        'k': 0 // King has no material value
    };
    
    let totalValue = 0;
    for (const [piece, count] of Object.entries(captured)) {
        totalValue += materialValues[piece as ChessPiece] * count;
    }
    return totalValue;
}

export const findPiece = (game: Chess, pieceType: PieceSymbol, color: Color) => {
    const board = game.board()
    const squares: Square[] = []; 

    for (let rank = 0; rank < 8; rank++) { 
        for (let file = 0; file < 8; file++) { 
            const piece = board[rank][file]; 
            if(piece && piece.type === pieceType && piece.color === color) { 
                // Convert rank and file to chess notation
                const fileChar = String.fromCharCode(97 + file); // 'a' is 97 in ASCII
                const rankChar = (8 - rank).toString();
                squares.push(`${fileChar}${rankChar}` as Square);
            }
        }
    }
    return squares; 
}