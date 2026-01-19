let currentFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Piece {

    constructor (piece) {
        this.node = piece;
        this.pieceName = piece.getAttribute("data-piece");
        this.row = parseInt(piece.getAttribute("data-row"));
        this.col = parseInt(piece.getAttribute("data-col"));
        this.color = this.pieceName ? this.pieceName[0] : null;
        this.pieceType = this.pieceName ? this.pieceName[1] : null;
        this.oppColor = this.color === "W" ? "B" : "W";
    }
}

let CheckCase = {
    node : [],
    checked : false,
    possibleMoves : [], 
    kingMoves : [],
    checkmated : false,
    testing : false,
    
}

function play(piece) {
    const item = new Piece(piece);
    const highlighted = document.querySelectorAll(".highlighted, .enemy, .highlightPiece");
    to_Play = currentFEN.split(" ")[1].toUpperCase();
    let moveMade = false;

    if (highlighted.length === 0 && (item.color === to_Play)) {
        if (!item.pieceName) return;
        
        if(item.pieceType === "K" && item.color === to_Play) {
            kingMove(item);
            return;
        } else {
            const dict = isPinned(item);
            if(dict && dict.size == 1) {
                pinImplementation(dict, item, currentFEN);
            } 
            
            else if(dict && dict.size >= 2) {
                return;
            }

            else {
                if(CheckCase.testing === true) {
                    moves = pinCheck(piece);
                    const commonElements = moves.filter(value => CheckCase.possibleMoves.includes(value));
                    
                    if(commonElements.length > 0) {
                        item.node.classList.add('highlightPiece');
                        commonElements.forEach(element => {
                            const node = document.querySelector(`.square[data-row="${element[0]}"][data-col="${element[1]}"]`);
                            const data = node.getAttribute("data-piece");
                            if(data[0] === item.oppColor) {
                                node.classList.add('enemy');
                                CheckCase.checked = false;
                            }
                        
                            else{
                                node.classList.add('highlighted');
                                CheckCase.checked = false;
                            }

                        })
                    }
                } else {
                    Pieces(item, currentFEN);
                }
            }
        }
    } 
    
    else {
        const selected = document.querySelector(".highlightPiece");

        if(!selected) {
            document.querySelectorAll(".highlighted, .enemy, .special")
                .forEach(sq => sq.classList.remove("highlighted", "enemy", "special"));
            return;
        }
        
        const compare = new Piece(selected);
        
        if ((item.pieceName && item.node !== compare.node && item.color === to_Play)) {
            
            document.querySelectorAll(".highlighted, .enemy, .special")
                .forEach(sq => sq.classList.remove("highlighted", "enemy", "special"));
            
            if(item.pieceType === "K") {
                kingMove(item);

                return;
            } else {
                
                const dict = isPinned(item);

                if(dict && dict.size == 1 && CheckCase.testing === false) {
                    pinImplementation(dict, item, currentFEN);
                }
                
                else if(dict && dict.size >= 2) {
                    return;
                }

                else {
                    if(CheckCase.testing === true) {
                        moves = pinCheck(piece);
                        const commonElements = moves.filter(value => CheckCase.possibleMoves.includes(value));
                        
                        if(commonElements.length > 0) {
                            item.node.classList.add('highlightPiece');
                            commonElements.forEach(element => {
                                const node = document.querySelector(`.square[data-row="${element[0]}"][data-col="${element[1]}"]`);
                                const data = node.getAttribute("data-piece");
                                if(data[0] === item.oppColor) {
                                    node.classList.add('enemy');
                                    CheckCase.checked = false;
                                }
                            
                                else{
                                    node.classList.add('highlighted');
                                    CheckCase.checked = false;
                                }

                            })
                        }
                    } else {
                        Pieces(item, currentFEN);
                    }
                }
            }
        } 

        else if(item.node === compare.node) {
            document.querySelectorAll(".highlighted, .enemy, .special")
                .forEach(sq => sq.classList.remove("highlighted", "enemy", "special"));
            return;
        }
       
        else {
            const newFEN = Move(item, currentFEN);
            moveMade = true;
            CheckCase.testing = false;
            const destinationSquare = document.querySelector(`.square[data-row="${item.row}"][data-col="${item.col}"]`);
            const movedPiece = new Piece(destinationSquare);
     
            inCheck(movedPiece);     

            if (newFEN) {
                currentFEN = newFEN;
            }
        }
    }

    if(CheckCase.checked === true && moveMade) {
        const destinationSquare = document.querySelector(`.square[data-row="${item.row}"][data-col="${item.col}"]`);
        const movedPiece = new Piece(destinationSquare);
        const possibleMoves = isCheckmated(movedPiece);

        if(possibleMoves) CheckCase.checkmated = false;
        else CheckCase.checkmated = true;
    }
}