function ManipulateFen(origin, dest, currentFEN) {
    const parts = currentFEN.split(" ");
    const board = parts[0].split("/");

    const expandRow = (rowStr) => {
        let arr = [];
        for (let ch of rowStr) {
            if (!isNaN(ch)) {
                arr.push(...Array(parseInt(ch)).fill(""));
            } else {
                arr.push(ch);
            }
        }
        return arr;
    };

    const collapseRow = (arr) => {
        let out = "";
        let empty = 0;
        for (let cell of arr) {
            if (cell === "") empty++;
            else {
                if (empty > 0) {
                    out += empty;
                    empty = 0;
                }
                out += cell;
            }
        }
        if (empty > 0) out += empty;
        return out;
    };
            
    if (origin.pieceType === "P" && (Math.abs(origin.row - dest.row) === 1) && (Math.abs(origin.col - dest.col) === 1) && !(currentFEN.split(" ")[3] === "-")) { 
        
        let current = expandRow(board[origin.row - 1]);
        current[dest.col - 1] = "";
        
        board[origin.row - 1] = collapseRow(current);
    }
    
    for (i = 0; i < board.length; i++) {
        let current = expandRow(board[i]);
        if (i === origin.row - 1) {
            current[origin.col - 1] = "";
        }
        if (i === dest.row - 1) {
            current[dest.col - 1] = (origin.color === "W") ? origin.pieceType.toUpperCase() : origin.pieceType.toLowerCase();
        }
        board[i] = collapseRow(current);
    }
    

    if (origin.pieceType === "P" && Math.abs(dest.row - origin.row) === 2) {
        const enPassantRow = (origin.color === "W") ? dest.row : dest.row;
        const file = "abcdefgh"
        parts[3] = `${file[dest.col - 1]}${enPassantRow}`;
    } else {
        parts[3] = "-";
    }

    if (origin.pieceType === "P" && (dest.row === 1))  {
        whitePromotion();
    }

    else if (origin.pieceType === "P" && (dest.row === 8) && Player.isBot === false)  {
        blackPromotion();
    } else if(origin.pieceType === "P" && (dest.row === 8) && Player.isBot === true){
        changeImageAuto("BQ", dest.row, dest.col, board);
    }

    parts[1] = (origin.color === "W") ? "b" : "w";
    const newBoard = board.join("/");

    // Replace the old board part in the FEN string
    parts[0] = newBoard;
    const newFEN = parts.join(" "); // Reconstruct the full FEN string
    return newFEN;
}

function changeImageAuto(piece, row, col, board) {
    const expandRow = (rowStr) => {
        let arr = [];
        for (let ch of rowStr) {
            if (!isNaN(ch)) {
                arr.push(...Array(parseInt(ch)).fill(""));
            } else {
                arr.push(ch);
            }
        }
        return arr;
    };

    const collapseRow = (arr) => {
        let out = "";
        let empty = 0;
        for (let cell of arr) {
            if (cell === "") empty++;
            else {
                if (empty > 0) {
                    out += empty;
                    empty = 0;
                }
                out += cell;
            }
        }
        if (empty > 0) out += empty;
        return out;
    };

    if(piece[0] === "B" && row === 8) {
        let boardRow = expandRow(board[7]);
        boardRow[col - 1] = piece[1].toLowerCase();
        board[7] = collapseRow(boardRow);
    }
    
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    
    if (square) {
        square.innerHTML = `<img src="/${Player.folder}/${piece}.png" alt="${piece}" />`;
        square.dataset.piece = piece;
    } 
}

function whitePromotion() {
    element = document.querySelector("#White_Promotion");
    div = document.querySelector(".container-WP");
    div.classList.add("overlay");
    element.style.display = "flex";

}

function blackPromotion() {
    element = document.querySelector("#Black_Promotion");
    div = document.querySelector(".container-BP");
    div.classList.add("overlay");
    element.style.display = "flex";
}

function changeImage(node) {
    const piece = node.dataset.piece;
    const parts = currentFEN.split(" ");
    const board = parts[0].split("/");
    let j = -1;
    let r = -1;

    const expandRow = (rowStr) => {
        let arr = [];
        for (let ch of rowStr) {
            if (!isNaN(ch)) {
                arr.push(...Array(parseInt(ch)).fill(""));
            } else {
                arr.push(ch);
            }
        }
        return arr;
    };

    const collapseRow = (arr) => {
        let out = "";
        let empty = 0;
        for (let cell of arr) {
            if (cell === "") empty++;
            else {
                if (empty > 0) {
                    out += empty;
                    empty = 0;
                }
                out += cell;
            }
        }
        if (empty > 0) out += empty;
        return out;
    };

    if(piece[0] === "W") {
        let row = expandRow(board[0]);

        for(i = 0; i < 8; i++) {
            if(row[i] === "P") {
                row[i] = piece[1];
                j = i + 1;
                r = 1;
                board[0] = collapseRow(row);
                div = document.querySelector(".container-WP");
                div.classList.remove("overlay");
                break;
            }
        }

        element = document.querySelector("#White_Promotion");
        element.style.display = "none";
    }

    if(piece[0] === "B") {
        row = expandRow(board[7]);
        for(i = 0; i < 8; i++) {
            if(row[i] === "p") {
                row[i] = piece[1].toLowerCase();
                j = i + 1;
                r = 8;
                board[7] = collapseRow(row);
                div = document.querySelector(".container-BP");
                div.classList.remove("overlay");
                break;
            }
        }

        element = document.querySelector("#Black_Promotion");
        element.style.display = "none";
    }

    const square = document.querySelector(`.square[data-row="${r}"][data-col="${j}"]`);
    square.innerHTML = `<img src="/${Player.folder}/${piece}.png" alt="${piece}" />`;
    square.dataset.piece = `${piece}`;
    parts[0] = board.join("/");
    const newBoard = board.join("/");
    
    parts[0] = newBoard;
    currentFEN = parts.join(" ");
}

function castlingFEN(origin, rook, currentFEN) {
    const parts = currentFEN.split(" ");
    const board = parts[0].split("/");

    const expandRow = (rowStr) => {
        let arr = [];
        for (let ch of rowStr) {
            if (!isNaN(ch)) {
                arr.push(...Array(parseInt(ch)).fill(""));
            } else {
                arr.push(ch);
            }
        }
        return arr;
    };

    const collapseRow = (arr) => {
        let out = "";
        let empty = 0;
        for (let cell of arr) {
            if (cell === "") empty++;
            else {
                if (empty > 0) {
                    out += empty;
                    empty = 0;
                }
                out += cell;
            }
        }
        if (empty > 0) out += empty;
        return out;
    };

    if (origin.color === "W" && rook.col === 4) {
        let updateRow = expandRow(board[7]);
        updateRow[4] = "";
        updateRow[0] = "";
        updateRow[2] = "K";
        updateRow[3] = "R";
        board[7] = collapseRow(updateRow);
        
        parts[0] = board.join("/");
        parts[1] = (origin.color === "W") ? "b" : "w";
        const newBoard = board.join("/");

        parts[0] = newBoard;
        currentFEN = parts.join(" ");
        return currentFEN;
    }

    else if (origin.color === "W" && rook.col === 6) {
        let updateRow = expandRow(board[7]);
        updateRow[4] = "";
        updateRow[7] = "";
        updateRow[6] = "K";
        updateRow[5] = "R";
        board[7] = collapseRow(updateRow);
        
        parts[0] = board.join("/");
        parts[1] = (origin.color === "W") ? "b" : "w";
        const newBoard = board.join("/");
        
        parts[0] = newBoard;
        currentFEN = parts.join(" ");
        return currentFEN;
    }
    else if (origin.color === "B" && rook.col === 4) {
        let updateRow = expandRow(board[0]);
        updateRow[4] = "";
        updateRow[0] = "";
        updateRow[2] = "k";
        updateRow[3] = "r";
        board[0] = collapseRow(updateRow);
        parts[0] = board.join("/");
        parts[1] = (origin.color === "W") ? "b" : "w";
        const newBoard = board.join("/");
        
        parts[0] = newBoard;
        currentFEN = parts.join(" ");
        return currentFEN;
    }
    else if (origin.color === "B" && rook.col === 6) {
        let updateRow = expandRow(board[0]);
        updateRow[4] = "";
        updateRow[7] = "";
        updateRow[6] = "k";
        updateRow[5] = "r";
        board[0] = collapseRow(updateRow);
        parts[0] = board.join("/");
        parts[1] = (origin.color === "W") ? "b" : "w";
        const newBoard = board.join("/");
        
        parts[0] = newBoard;
        currentFEN = parts.join(" ");
        return currentFEN;
    }

    return null;
}
