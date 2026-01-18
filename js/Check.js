function isPinned(piece) {
    const oppBishop = document.querySelectorAll(`.square[data-piece="${piece.oppColor}B"]`);
    const oppRook = document.querySelectorAll(`.square[data-piece="${piece.oppColor}R"]`);
    const oppQueen = document.querySelectorAll(`.square[data-piece="${piece.oppColor}Q"]`);

    const pinMap = new Map();

    if (oppBishop) {
        oppBishop.forEach(element => {

            const iteration_Bishop = [[1,-1], [1,1], [-1,-1], [-1,1]];
            const item = new Piece(element);

            const traversingNode_Bishop = (rowDir, colDir) => {
                let dist = 1;
                let foundPiece = false;

                while(true) {
                    const target_row = item.row + rowDir*dist;
                    const target_col = item.col + colDir*dist;
                
                    if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) {
                        break;
                    }

                    const square_node = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                    const square = new Piece(square_node);
                    
                    if (square.color === piece.oppColor) {
                        break;
                    }

                    if (square.color === piece.color && square.node !== piece.node && square.pieceType !== "K") {
                        break;
                    }
                
                    if (square.node === piece.node) {
                        foundPiece = true;
                    }
                
                    if (square.pieceType === "K" && square.color === piece.color && foundPiece) {
                        const array = [rowDir, colDir];
                        pinMap.set(element, array);
                        break;
                    }
                
                    dist++;
                }
            }

            iteration_Bishop.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Bishop(num1, num2);
            })
        });
    }

    if (oppRook) {
        oppRook.forEach( element => {
            const iteration_Rook = [[1,0], [0,1], [-1,0], [0,-1]];
            const item = new Piece(element);

            const traversingNode_Rook = (rowDir, colDir) => {
                let dist = 1;
                let foundPiece = false;

                while(true) {
                    const target_row = item.row + rowDir*dist;
                    const target_col = item.col + colDir*dist;
                
                    if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) {
                        break;
                    }

                    const square_node = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                    const square = new Piece(square_node);
                    
                    if (square.color === piece.oppColor) {
                        break;
                    }

                    if (square.color === piece.color && square.node !== piece.node && square.pieceType !== "K") {
                        break;
                    }
                
                    if (square.node === piece.node) {
                        foundPiece = true;
                    }
                
                    if (square.pieceType === "K" && square.color === piece.color && foundPiece) {
                        const array = [rowDir, colDir];
                        pinMap.set(element, array);
                        break;
                    }
                    dist++;
                }
            }

            iteration_Rook.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Rook(num1, num2);
            })
        })
    }

    if (oppQueen) {
        oppQueen.forEach( element => {
            const iteration_Queen = [[0,1], [0,-1], [1,0], [1,1], [1,-1], [-1,0], [-1,-1], [-1,1]];
            const item = new Piece(element);

            const traversingNode_Queen = (rowDir, colDir) => {
                let dist = 1;
                let foundPiece = false;

                while(true) {
                    const target_row = item.row + rowDir*dist;
                    const target_col = item.col + colDir*dist;
                
                    if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) {
                        break;
                    }

                    const square_node = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                    const square = new Piece(square_node);
                    
                    if (square.color === piece.oppColor) {
                        break;
                    }

                    if (square.color === piece.color && square.node !== piece.node && square.pieceType !== "K") {
                        break;
                    }
                
                    if (square.node === piece.node) {
                        foundPiece = true;
                    }
                
                    if (square.pieceType === "K" && square.color === piece.color && foundPiece) {
                        const array = [rowDir, colDir];
                        pinMap.set(element, array);
                        break;
                    }
                
                    dist++;
                }
            }

            iteration_Queen.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Queen(num1, num2);
            })
        })
    } 

    return pinMap;
}

function kingMove(piece) {
    if (!piece) return;
    const parts = currentFEN.split(" ");
    let castling = parts[2].split("");
    const kingMoves = [];
    const iteration = [[0,1], [0,-1], [1,0], [1,1], [1,-1], [-1,0], [-1,-1], [-1,1]];

    const traversingNode_King = (rowDir, colDir) => {
        const target_col = piece.col + colDir;
        const target_row = piece.row + rowDir;
    
        const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
    
        if (targetNode) {
            const pieceAtSquare = targetNode.getAttribute("data-piece");
        
            if (!pieceAtSquare) {
                let element = `${target_row}${target_col}`;
                kingMoves.push(element);

                if (rowDir === 0 && colDir === 1) {

                    const castlingRights = currentFEN.split(" ")[2];
                    const canCastle = piece.color === "W" ? castlingRights.includes("K") : castlingRights.includes("k");

                    if (canCastle && CheckCase.checked === false) {
                        const castlingNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col + 1}"]`);
                        if (castlingNode) {
                            const pieceAtCastling = castlingNode.getAttribute("data-piece");
                            if (!pieceAtCastling) {
                                // Verify rook exists
                                const rookSquare = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col + 2}"]`);
                                const rookPiece = rookSquare?.getAttribute("data-piece");
                                if (rookPiece && rookPiece[0] === piece.color && rookPiece[1] === "R") {
                                    let element = `${target_row}${target_col + 1}`;
                                    kingMoves.push(element);
                                }
                            }
                        }
                    }
                }

                else if (rowDir === 0 && colDir === -1) {
                    const castlingRights = currentFEN.split(" ")[2];
                    const canCastle = piece.color === "W" ? castlingRights.includes("Q") : castlingRights.includes("q");

                    if (canCastle && CheckCase.checked === false) {
                        const castlingNode1 = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col - 1}"]`);

                        if (castlingNode1) {
                            const pieceAtCastling1 = castlingNode1.getAttribute("data-piece");

                            if (!pieceAtCastling1) {
                                const castlingNode2 = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col - 2}"]`);
                                const pieceAtCastling2 = castlingNode2?.getAttribute("data-piece");

                                if (!pieceAtCastling2) {
                                    // Verify rook exists
                                    const rookSquare = document.querySelector(`.square[data-row="${target_row}"][data-col="1"]`);
                                    const rookPiece = rookSquare?.getAttribute("data-piece");

                                    if (rookPiece && rookPiece[0] === piece.color && rookPiece[1] === "R") {
                                        let element = `${target_row}${target_col - 1}`;
                                        kingMoves.push(element);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(pieceAtSquare[0] === piece.oppColor) {
                let element = `${target_row}${target_col}`;
                kingMoves.push(element);
            }
        }
    }

    iteration.forEach(pair => {
        const num1 = pair[0];
        const num2 = pair[1];
        traversingNode_King(num1, num2);
    });
    
    const oppPieces = document.querySelectorAll(`.square[data-piece^="${piece.oppColor}"]`);
    
    oppPieces.forEach(oppPiece => {
        const array = check(oppPiece);
        
        if(array) {
            array.forEach(element => {
            if (kingMoves.includes(element)) {  
                const index = kingMoves.indexOf(element);
                if (index !== -1) {
                    kingMoves.splice(index, 1);
                }
            }
        });
        }
    })

    if(kingMoves) {
        
        kingMoves.forEach(element => {
            const node = document.querySelector(`.square[data-row="${element[0]}"][data-col="${element[1]}"]`);
            const data = node.getAttribute("data-piece");

            if(data[0] === piece.oppColor) {
                node.classList.add('enemy');
            }

            else if (element === "83" || element === "13"){
                if(kingMoves.includes("84") && castling.includes("Q")) {
                    node.classList.add('special');
                }

                else if(kingMoves.includes("14") && castling.includes("q")) {
                    node.classList.add('special');
                } else {
                    return;
                }
            }

            else if (element === "87" || element === "17"){
                if(kingMoves.includes("86") && castling.includes("K")) {
                    node.classList.add('special');
                }
                
                else if(kingMoves.includes("16") && castling.includes("k")) {
                    node.classList.add('special');
                }
                else {
                    return;
                }
            }

            else {
                node.classList.add('highlighted');
            }
        })
    }
    
    piece.node.classList.add('highlightPiece');
    
}

function kingMoveCheck(piece) {
    if (!piece) return;

    const kingMoves = [];
    const iteration = [[0,1], [0,-1], [1,0], [1,1], [1,-1], [-1,0], [-1,-1], [-1,1]];

    const traversingNode_King = (rowDir, colDir) => {
        const target_col = piece.col + colDir;
        const target_row = piece.row + rowDir;
    
        const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
    
        if (targetNode) {
            const pieceAtSquare = targetNode.getAttribute("data-piece");
        
            if (!pieceAtSquare) {
                let element = `${target_row}${target_col}`;
                kingMoves.push(element);

                if (rowDir === 0 && colDir === 1) {

                    const castlingRights = currentFEN.split(" ")[2];
                    const canCastle = piece.color === "W" ? castlingRights.includes("K") : castlingRights.includes("k");

                    if (canCastle && CheckCase.checked === false) {
                        const castlingNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col + 1}"]`);
                        if (castlingNode) {
                            const pieceAtCastling = castlingNode.getAttribute("data-piece");
                            if (!pieceAtCastling) {
                                // Verify rook exists
                                const rookSquare = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col + 2}"]`);
                                const rookPiece = rookSquare?.getAttribute("data-piece");
                                if (rookPiece && rookPiece[0] === piece.color && rookPiece[1] === "R") {
                                    let element = `${target_row}${target_col + 1}`;
                                    kingMoves.push(element);
                                }
                            }
                        }
                    }
                }

                else if (rowDir === 0 && colDir === -1) {
                    const castlingRights = currentFEN.split(" ")[2];
                    const canCastle = piece.color === "W" ? castlingRights.includes("Q") : castlingRights.includes("q");

                    if (canCastle && CheckCase.checked === false) {
                        const castlingNode1 = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col - 1}"]`);

                        if (castlingNode1) {
                            const pieceAtCastling1 = castlingNode1.getAttribute("data-piece");

                            if (!pieceAtCastling1) {
                                const castlingNode2 = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col - 2}"]`);
                                const pieceAtCastling2 = castlingNode2?.getAttribute("data-piece");

                                if (!pieceAtCastling2) {
                                    // Verify rook exists
                                    const rookSquare = document.querySelector(`.square[data-row="${target_row}"][data-col="1"]`);
                                    const rookPiece = rookSquare?.getAttribute("data-piece");

                                    if (rookPiece && rookPiece[0] === piece.color && rookPiece[1] === "R") {
                                        let element = `${target_row}${target_col - 1}`;
                                        kingMoves.push(element);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(pieceAtSquare[0] === piece.oppColor) {
                let element = `${target_row}${target_col}`;
                kingMoves.push(element);
            }
        }
    }

    iteration.forEach(pair => {
        const num1 = pair[0];
        const num2 = pair[1];
        traversingNode_King(num1, num2);
    });
    
    const oppPieces = document.querySelectorAll(`.square[data-piece^="${piece.oppColor}"]`);
    
    oppPieces.forEach(oppPiece => {
        const array = check(oppPiece);
        
        if(array) {
            array.forEach(element => {
            if (kingMoves.includes(element)) {  
                const index = kingMoves.indexOf(element);
                if (index !== -1) {
                    kingMoves.splice(index, 1);
                }
            }
        });
        }
    })
    
    return kingMoves;
}

function possibleMove(piece) {
    const item = new Piece(piece);
    let moves = [];
    moves.push(`${item.row}${item.col}`);
    let inCheck = 0;
    switch (item.pieceName) {
        case "WP":
            if (item.row > 0) {

                let left = document.querySelector(`.square[data-row="${item.row - 1}"][data-col="${item.col - 1}"]`);
                let right = document.querySelector(`.square[data-row="${item.row - 1}"][data-col="${item.col + 1}"]`);

                if (left) {
                    if(kingDanger(left, piece) === 1) {
                        inCheck = 1;
                    }
                }

                if (right) {
                    if(kingDanger(right, piece) === 1) {
                        inCheck = 1;
                    }
                }

                if(inCheck === 1) moves.push("1");
            }
            
            return moves;
        
        case "BP":
            if (item.row > 0) {
                
                let left = document.querySelector(`.square[data-row="${item.row + 1}"][data-col="${item.col - 1}"]`);
                let right = document.querySelector(`.square[data-row="${item.row + 1}"][data-col="${item.col + 1}"]`);

                if (left) {
                    if(kingDanger(left, piece) === 1) {
                        inCheck = 1;
                    }
                }

                if (right) {
                    if(kingDanger(right, piece) === 1) {
                        inCheck = 1;
                    }
                }

                if(inCheck === 1) moves.push("1");
            }
            
            return moves;
        
        case "WB":
            
        case "BB":
            const iteration_Bishop = [[1,-1], [1,1], [-1,-1], [-1,1]];
            const traversingNode_Bishop = (rowDir, colDir) => {
                dist = 1;

                while(true) {
                    const target_row = item.row + rowDir*dist;
                    const target_col = item.col + colDir*dist;

                    if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) break;

                    const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                    if (!targetNode) break;
                
                    const pieceAtSquare = targetNode.getAttribute("data-piece");

                    if (pieceAtSquare[0] === item.color) {
                        break;
                    };

                    if (pieceAtSquare[0] === item.oppColor && pieceAtSquare[1] !== "K") break;
                    
                    if(kingDanger(targetNode, piece)) {
                        inCheck = 1;
                        moves.push(...traversingNode(rowDir, colDir, item));
                        if(inCheck === 1) moves.push("1");
                        return moves;
                    }
                    dist++;
                }
            }

            iteration_Bishop.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Bishop(num1, num2);
            });
            return moves;

        case "WN":
            
        case "BN":
            const iteration_Knight = [[1,2], [-1,2], [-1,-2], [1,-2], [2,-1], [2,1], [-2,-1], [-2,1]];

            const traversingNode_Knight = (rowDir, colDir) => {

                const target_row = item.row + rowDir;
                const target_col = item.col + colDir;
                if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) return;

                const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                if (!targetNode) return;
                if(kingDanger(targetNode, piece) === 1) {
                    inCheck = 1;
                    if(inCheck === 1) moves.push("1");
                    return moves;
                }
            }

            iteration_Knight.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Knight(num1, num2);
            });
            return moves;
        
        case "WR":

        case "BR":
            const iteration_Rook = [[1,0], [0,1], [-1,0], [0,-1]];

            const traversingNode_Rook = (rowDir, colDir) => {
                dist = 1;

                while(true) {

                    target_row = item.row + rowDir*dist;
                    target_col = item.col + colDir*dist;

                    if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) break;

                    const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                    if (!targetNode) break;
                
                    const pieceAtSquare = targetNode.getAttribute("data-piece");

                    if(kingDanger(targetNode, piece)) {
                        inCheck = 1;
                        moves.push(...traversingNode(rowDir, colDir, item));
                        if(inCheck === 1) moves.push("1");
                        return moves;
                    }
                    
                    if (!pieceAtSquare) {
                        dist++;
                        continue;
                    }

                    if (pieceAtSquare[0] === item.color) {
                        break;
                    };

                    if (pieceAtSquare[0] === item.oppColor && pieceAtSquare[1] !== "K") break;
                    
                    dist++;
                }


            }

            iteration_Rook.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Rook(num1, num2);
            });
            if(inCheck === 1) moves.push("1");

            return moves;
        
        case "WQ":

        case "BQ":
            const iteration_Queen = [[0,1], [0,-1], [1,0], [1,1], [1,-1], [-1,0], [-1,-1], [-1,1]];

            const traversingNode_Queen = (rowDir, colDir) => {
                let dist = 1;

                while(true) {

                    target_row = item.row + rowDir*dist;
                    target_col = item.col + colDir*dist;

                    if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) break;

                    const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                    if (!targetNode) break;
                
                    const pieceAtSquare = targetNode.getAttribute("data-piece");

                    if(kingDanger(targetNode, piece)) {
                        inCheck = 1;
                        moves.push(...traversingNode(rowDir, colDir, item));
                        moves.push("1");
                        return moves;
                    }
                    
                    if (!pieceAtSquare) {
                        dist++;
                        continue;
                    }

                    if (pieceAtSquare[0] === item.color) {
                        break;
                    };

                    if (pieceAtSquare[0] === item.oppColor && pieceAtSquare[1] !== "K") break;

                    dist++;
                }


            }

            iteration_Queen.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Queen(num1, num2);
            });
            return moves;

        case "BK":

        case "WK":
            
            const iteration = [[0,1], [0,-1], [1,0], [1,1], [1,-1], [-1,0], [-1,-1], [-1,1]];
            const traversingNode_King = (rowDir, colDir) => {

                const target_col = item.col + colDir;
                const target_row = item.row + rowDir;
            
                const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                if (targetNode) {
                    const pieceAtSquare = targetNode.getAttribute("data-piece");
                    if(kingDanger(targetNode, piece)) inCheck = 1;
                    if (!pieceAtSquare) {
                        let element = `${target_row}${target_col}`;
                        moves.push(element);
                    }
                    
                    if (pieceAtSquare[0] === item.color) {
                        let element = `${target_row}${target_col}`;
                        moves.push(element);
                    };
                } else return;
            }

            iteration.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_King(num1, num2);
            });

            return moves;
    }
}

function traversingNode(rowDir, colDir, item) {
    let dist = 1;
    let moves = [];
    let element = `${item.row}${item.col}`;
    moves.push(element);
    while(true) {
        target_row = item.row + rowDir*dist;
        target_col = item.col + colDir*dist;
        if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) break;
        const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
        if (!targetNode) break;
    
        const pieceAtSquare = targetNode.getAttribute("data-piece");
        
        if (!pieceAtSquare) {
            let element = `${target_row}${target_col}`;
            moves.push(element);
            dist++;
            continue;
        }
        if (pieceAtSquare[0] === item.color || pieceAtSquare[0] === item.oppColor) {
            break;
        };
        dist++;
    }
    return moves;
}