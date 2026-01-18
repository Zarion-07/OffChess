
function Pieces(item, currentFEN) {
    
    document.querySelectorAll(".highlighted, .highlightPiece, .enemy")
        .forEach(sq => sq.classList.remove("highlighted", "highlightPiece", "enemy"));
    
    item.node.classList.add('highlightPiece');

    switch (item.pieceName) {

        case "WP":
            if (item.row > 0) {
                let a = 1;
                if (item.row <= 7 && item.row > 0) {
                    let one = document.querySelector(`.square[data-row="${item.row - 1}"][data-col="${item.col}"]`);
                    const pieceAtSquare = one.getAttribute("data-piece");
                    if (!pieceAtSquare) {
                        one.classList.add('highlighted');
                    } else a = 0;
                }

                if (item.row === 7 && a === 1) {
                    let two = document.querySelector(`.square[data-row="${item.row - 2}"][data-col="${item.col}"]`);
                    if (two) {
                        const pieceAtSquare1 = two.getAttribute("data-piece");
                        if (!pieceAtSquare1) {
                            two.classList.add('highlighted');
                        }
                    }
                }

                let left = document.querySelector(`.square[data-row="${item.row - 1}"][data-col="${item.col - 1}"]`);
                let right = document.querySelector(`.square[data-row="${item.row - 1}"][data-col="${item.col + 1}"]`);

                if (left) {
                    const leftPiece = left.getAttribute("data-piece");
                    if (leftPiece && leftPiece[0] === "B") {
                        left.classList.add('enemy');
                    }
                }

                if (right) {
                    const rightPiece = right.getAttribute("data-piece");
                    if (rightPiece && rightPiece[0] === "B") {
                        right.classList.add('enemy');
                    }
                }

                let data = currentFEN.split(" ")[3];
                let file = data[0];
                file = file.charCodeAt(0) - '`'.charCodeAt(0);
                let enPassantCol = parseInt(file);
                
                if (data != "-" && (Math.abs(enPassantCol - item.col) === 1) && item.row === 4) {
                    let enPassantSq = document.querySelector(`.square[data-row="${item.row - 1}"][data-col="${enPassantCol}"]`);
                    const pieceAtSquare3 = enPassantSq.getAttribute("data-piece");
               
                    if (!pieceAtSquare3) {
                        enPassantSq.classList.add('enemy');
                    }
                }
            }
            
            break;
        
        case "BP":
            if (item.row > 0) {
                let a = 1;
                if (item.row <= 7 && item.row > 0) {
                    let one = document.querySelector(`.square[data-row="${item.row + 1}"][data-col="${item.col}"]`);
                    const pieceAtSquare = one.getAttribute("data-piece");
                    if (!pieceAtSquare) {
                        one.classList.add('highlighted');
                    } else a = 0;
                }

                if (item.row === 2 && a === 1) {
                    let two = document.querySelector(`.square[data-row="${item.row + 2}"][data-col="${item.col}"]`);
                    const pieceAtSquare1 = two.getAttribute("data-piece");
                    if (!pieceAtSquare1) {
                        two.classList.add('highlighted');
                    }
                }

                let left = document.querySelector(`.square[data-row="${item.row + 1}"][data-col="${item.col - 1}"]`);
                let right = document.querySelector(`.square[data-row="${item.row + 1}"][data-col="${item.col + 1}"]`);

                if (left) {
                    const leftPiece = left.getAttribute("data-piece");
                    if (leftPiece && leftPiece[0] === "W") {
                        left.classList.add('enemy');
                    }
                }

                if (right) {
                    const rightPiece = right.getAttribute("data-piece");
                    if (rightPiece && rightPiece[0] === "W") {
                        right.classList.add('enemy');
                    }
                }

                let data = currentFEN.split(" ")[3];
                let file = data[0];
                file = file.charCodeAt(0) - '`'.charCodeAt(0);
                let enPassantCol = parseInt(file) ;
                if (data != "-" && (Math.abs(enPassantCol - item.col) === 1) && item.row === 5) {

                    let enPassantSq = document.querySelector(`.square[data-row="${item.row + 1}"][data-col="${enPassantCol}"]`);
                    const pieceAtSquare3 = enPassantSq.getAttribute("data-piece");
              
                    if (!pieceAtSquare3) {
                        enPassantSq.classList.add('enemy');
                    }
                }
            }
            break;
        
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
                    if (!pieceAtSquare) {
                        targetNode.classList.add('highlighted');
                        dist++;
                        continue;
                    }

                    if (pieceAtSquare[0] === item.color) break;

                    if (pieceAtSquare[0] === item.oppColor) {
                        targetNode.classList.add('enemy');
                        break;
                    }
                    dist++;
                }


            }

            iteration_Bishop.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Bishop(num1, num2);
            });

            break;

        case "WN":

        case "BN":
            const iteration_Knight = [[1,2], [-1,2], [-1,-2], [1,-2], [2,-1], [2,1], [-2,-1], [-2,1]];

            const traversingNode_Knight = (rowDir, colDir) => {

                const target_row = item.row + rowDir;
                const target_col = item.col + colDir;

                if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) return;

                const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                if (!targetNode) return;

                const pieceAtSquare = targetNode.getAttribute("data-piece");

                if (!pieceAtSquare) {
                    targetNode.classList.add('highlighted');
                }

                else if (pieceAtSquare[0] === item.oppColor) {
                    targetNode.classList.add('enemy');
                }
            }

            iteration_Knight.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Knight(num1, num2);
            });

            break;
        
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
                    
                    if (!pieceAtSquare) {
                        targetNode.classList.add('highlighted');
                        dist++;
                        continue;
                    }

                    if (pieceAtSquare[0] === item.color) break;

                    if (pieceAtSquare[0] === item.oppColor) {
                        targetNode.classList.add('enemy');
                        break;
                    }
                    dist++;
                }


            }

            iteration_Rook.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Rook(num1, num2);
            });

            break;
        
        case "WQ":

        case "BQ":

            const iteration_Queen = [[0,1], [0,-1], [1,0], [1,1], [1,-1], [-1,0], [-1,-1], [-1,1]];

            const traversingNode_Queen = (rowDir, colDir) => {
                dist = 1;

                while(true) {

                    target_row = item.row + rowDir*dist;
                    target_col = item.col + colDir*dist;
                  
                    if (target_row < 1 || target_row > 8 || target_col < 1 || target_col > 8) break;

                    const targetNode = document.querySelector(`.square[data-row="${target_row}"][data-col="${target_col}"]`);
                    if (!targetNode) break;
                
                    const pieceAtSquare = targetNode.getAttribute("data-piece");
                    
                    if (!pieceAtSquare) {
                        targetNode.classList.add('highlighted');
                        dist++;
                        continue;
                    }

                    if (pieceAtSquare[0] === item.color) break;

                    if (pieceAtSquare[0] === item.oppColor) {
                        targetNode.classList.add('enemy');
                        break;
                    }
                    dist++;
                }


            }

            iteration_Queen.forEach(pair => {
                const num1 = pair[0];
                const num2 = pair[1];
                traversingNode_Queen(num1, num2);
            });

            break;
    }
}