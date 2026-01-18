function Move(square, currentFEN) {
    let avail = false;
    let special = 0;
    let castleFEN;

    document.querySelectorAll(".highlighted, .enemy, .special").forEach(sq => {
        if (
            square.row === parseInt(sq.getAttribute("data-row")) &&
            square.col === parseInt(sq.getAttribute("data-col"))
        ) {
            avail = true;
        }
    });

    if (avail) {
        const shooter = document.querySelector(".highlightPiece");
        var origin = new Piece(shooter);
        shooter.setAttribute("data-piece", "");
        shooter.innerHTML = "";

        if (origin.pieceType === "P") {

            const enPassant_Move = currentFEN.split(" ")[3];

            col = enPassant_Move[0].charCodeAt(0) - '`'.charCodeAt(0);
            enPassantCol = parseInt(col);
            enPassantRow = parseInt(enPassant_Move[1]);
            
            if (enPassantCol === square.col && (Math.abs(enPassantRow - origin.row) === 0) && (Math.abs(enPassantCol - origin.col) === 1) && !(enPassant_Move === "-")) {
                
                enPassantNode = document.querySelector(`.square[data-row="${enPassantRow}"][data-col="${enPassantCol}"]`);
                enPassantNode.setAttribute("data-piece", "");
                enPassantNode.innerHTML = "";
            }

            
        }

        let parts = currentFEN.split(" ");
        let castling = parts[2].split("");
        if (origin.pieceType === "R" && (castling[0] === "K" || castling[3] === "q") && origin.col === 8) {
            if (origin.color === "W") {
                castling.splice(0, 1, "-");
            } else {
                castling.splice(3, 1, "-");
            }
            parts[2] = castling.join("");
            currentFEN = parts.join(" ");
        }

        if (origin.pieceType === "R" && (castling[1] === "Q" || castling[2] === "k") && origin.col === 1) {
            if (origin.color === "W") {
                castling.splice(1, 1, "-");
            } else {
                castling.splice(2, 1, "-");
            }
            parts[2] = castling.join("");
            currentFEN = parts.join(" ");
        }

        if (origin.pieceName === "WK" && (castling[0] === "K" || castling[1] === "Q")) {
            castling.splice(0, 1, "-");
            castling.splice(1, 1, "-");
            const Qnode = document.querySelector(`.special[data-row="8"][data-col="3"]`);
            const Knode = document.querySelector(`.special[data-row="8"][data-col="7"]`);

            if (Qnode && square.col === 3) {
                
                currentRook = document.querySelector(`[data-row="8"][data-col="1"]`);
                currentRook.setAttribute("data-piece", "");
                currentRook.innerHTML = "";

                newRook = document.querySelector(`[data-row="8"][data-col="4"]`);
                newRook.innerHTML = `<img src="/${Player.folder}/WR.png" alt="WR" />`;
                newRook.setAttribute("data-piece", "WR");

                var Rook = new Piece(newRook);
                castleFEN = castlingFEN(origin, Rook, currentFEN);
                const castlePart = castleFEN.split(" ");
                castling.splice(0, 1, "-");
                castling.splice(1, 1, "-");
                castlePart[2] = castling.join("");
                parts = castlePart;
                currentFEN = castlePart.join(" ");
                special = 1;
            }

            else if (Knode && square.col === 7) {
                
                currentRook = document.querySelector(`[data-row="8"][data-col="8"]`);
                currentRook.setAttribute("data-piece", "");
                currentRook.innerHTML = "";

                newRook = document.querySelector(`[data-row="8"][data-col="6"]`);
                newRook.innerHTML = `<img src="/${Player.folder}/WR.png" alt="WR" />`;
                newRook.setAttribute("data-piece", "WR");
                
                var Rook = new Piece(newRook);
                castleFEN = castlingFEN(origin, Rook, currentFEN);
                const castlePart = castleFEN.split(" ");
                castling.splice(0, 1, "-");
                castling.splice(1, 1,"-");
                
                castlePart[2] = castling.join("");
                parts = castlePart;
                currentFEN = castlePart.join(" ");
                special = 1;
            }
            parts[1] = "b";
            parts[2] = castling.join("");
            currentFEN = parts.join(" ");
        }

        else if (origin.pieceName === "BK" && (castling[2] === "k" || castling[3] === "q")) {
            castling.splice(2, 1, "-");
            castling.splice(3, 1, "-");
            const Knode = document.querySelector(`.special[data-row="1"][data-col="7"]`);
            const Qnode = document.querySelector(`.special[data-row="1"][data-col="3"]`);
            if (Qnode && square.col === 3) {
                
                const currentRook = document.querySelector(`[data-row="1"][data-col="1"]`);
                currentRook.setAttribute("data-piece", "");
                currentRook.innerHTML = "";

                const newRook = document.querySelector(`[data-row="1"][data-col="4"]`);
                newRook.innerHTML = `<img src="/${Player.folder}/BR.png" alt="BR" />`;
                newRook.setAttribute("data-piece", "BR");

                var Rook = new Piece(newRook);
                castleFEN = castlingFEN(origin, Rook, currentFEN);
                const castlePart = castleFEN.split(" ");

                castling.splice(2, 1, "-");
                castling.splice(3, 1, "-");
                castlePart[2] = castling.join("");
                parts = castlePart;
                special = 1;
            }

            else if (Knode && square.col === 7) {
                
                currentRook = document.querySelector(`[data-row="1"][data-col="8"]`);
                currentRook.setAttribute("data-piece", "");
                currentRook.innerHTML = "";

                newRook = document.querySelector(`[data-row="1"][data-col="6"]`);
                newRook.innerHTML = `<img src="/${Player.folder}/BR.png" alt="BR" />`;
                newRook.setAttribute("data-piece", "BR");

                var Rook = new Piece(newRook);
                castleFEN = castlingFEN(origin, Rook, currentFEN);
                const castlePart = castleFEN.split(" ");
                castling.splice(2, 1, "-");
                castling.splice(3, 1, "-");
                castlePart[2] = castling.join("");
                parts = castlePart;
                special = 1;
            }
            parts[1] = "w";
            parts[2] = castling.join("");
            currentFEN = parts.join(" ");
        }

        square.node.innerHTML = `<img src="/${Player.folder}/${origin.pieceName}.png" alt="${origin.pieceName}" />`;
        square.node.setAttribute("data-piece", origin.pieceName);

        document.querySelectorAll(".highlighted, .highlightPiece, .enemy, .special")
            .forEach(sq => sq.classList.remove("highlighted", "highlightPiece", "enemy", "special"));

        if (special === 0) {
            let newFEN = ManipulateFen(origin, square, currentFEN);
            return newFEN;
        }
        
        else {
            let newFEN = currentFEN;
            return newFEN;
        }
    }

    
    document.querySelectorAll(".highlighted, .highlightPiece, .enemy, .special")
        .forEach(sq => sq.classList.remove("highlighted", "highlightPiece", "enemy", "special"));
}