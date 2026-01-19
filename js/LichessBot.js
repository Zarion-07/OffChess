function getDifficultyFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty');
    
    if (difficulty) {
        console.log('Difficulty from URL:', difficulty);
        return parseInt(difficulty);
    }
    
    const storedDifficulty = localStorage.getItem('botDifficulty');
    if (storedDifficulty) {
        console.log('Difficulty from localStorage:', storedDifficulty);
        return parseInt(storedDifficulty);
    }
    
    console.log('Using default difficulty: 10');
    return 10;
}

let depth = getDifficultyFromURL();

class StockfishBot {
    constructor() {
        this.engine = new Worker('/js/stockfish.js');
        this.engineReady = false;
        this.onMoveCallback = null;
        
        this.engine.onmessage = (event) => {
            const line = event.data;

            if (line === 'readyok') {
                this.engineReady = true;
            }

            if (line.startsWith('bestmove')) {
                const match = line.match(/bestmove\s([a-h][1-8][a-h][1-8])/);
                if (match && this.onMoveCallback) {
                    this.onMoveCallback(match[1]);
                }
            }
        };

        this.engine.postMessage('uci');
        this.engine.postMessage('isready');
    }

    getBestMove(fen, callback, depth) {
        console.log(depth);
        if (!this.engineReady) {
            console.warn('Engine not ready yet, skipping');
            return;
        }

        this.onMoveCallback = callback;

        this.engine.postMessage(`position fen ${fen}`);
        this.engine.postMessage(`go depth ${depth}`);
    }
    
    stop() {
        this.engine.postMessage('stop');
    }
    
    quit() {
        this.engine.postMessage('quit');
        this.engine.terminate();
    }
}

let bot = new StockfishBot();

function makeBotMove() {
    bot.getBestMove(currentFEN, (move) => {
        
        const fromCol = move[0].charCodeAt(0) - 96;
        const fromRow = 9 - parseInt(move[1]); 
        const toCol = move[2].charCodeAt(0) - 96;
        const toRow = 9 - parseInt(move[3]);
        
        const fromSquare = document.querySelector(
            `.square[data-row="${fromRow}"][data-col="${fromCol}"]`
        );
        const toSquare = document.querySelector(
            `.square[data-row="${toRow}"][data-col="${toCol}"]`
        );
        
        if (fromSquare && toSquare) {
            // First click to select piece
            play(fromSquare);
            
            // Second click to move
            setTimeout(() => {
                play(toSquare);
            }, 100);
        }
    }, depth);
}

function afterPlayerMove() {
    const currentPlayer = currentFEN.split(" ")[1];
    
    if (currentPlayer !== Player.color.toLowerCase()) {
        setTimeout(() => {
            makeBotMove();
        }, 300);
    }
}

function playBot(piece) {
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
            document.querySelectorAll(".highlighted, .enemy")
                .forEach(sq => sq.classList.remove("highlighted", "enemy"));
            return;
        }
        
        const compare = new Piece(selected);
        
        if ((item.pieceName && item.node !== compare.node && item.color === to_Play)) {
            
            document.querySelectorAll(".highlighted, .highlightPiece, .enemy")
                .forEach(sq => sq.classList.remove("highlighted", "highlightPiece", "enemy"));
            
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
            document.querySelectorAll(".highlighted, .enemy")
                .forEach(sq => sq.classList.remove("highlighted", "enemy"));
            return;
        }
        
        else {
            const newFEN = Move(item, currentFEN);
            moveMade = true;
            
            
            if(CheckCase.testing === true) CheckCase.testing = false;
            CheckCase.checked = false;
            CheckCase.possibleMoves = [];
            CheckCase.kingMoves = [];
            CheckCase.node = [];
            
            const destinationSquare = document.querySelector(
                `.square[data-row="${item.row}"][data-col="${item.col}"]`
            );
            const movedPiece = new Piece(destinationSquare);

            inCheck(movedPiece);
            
            if (newFEN) {
                currentFEN = newFEN;
                // Check for checkmate after move
                if(CheckCase.checked === true) {
                    const possibleMoves = isCheckmated(movedPiece);
                    if(possibleMoves) CheckCase.checkmated = false;
                    else CheckCase.checkmated = true;
                }
                
                // TRIGGER BOT HERE
                triggerBotIfNeeded();
            }
        }
    }
}

function triggerBotIfNeeded() {
    const currentPlayer = currentFEN.split(" ")[1];
    
    if (currentPlayer !== Player.color.toLowerCase() && !CheckCase.checkmated) {
        setTimeout(() => {
            makeBotMove();
        }, 300);
    }
}

function changeDifficulty(level) {
    console.log(level)
    depth = level;
}

function changeFEN(currentFEN) {
    let parts = currentFEN.split(" ");
    let moves = parts[0].split("/");
    let castle = parts[2];

    moves = reverse(moves);

    let newCastle = "";
    for (let i = 0; i < castle.length; i++) {
        let c = castle[i];
        if (c === c.toLowerCase()) {
            newCastle += c.toUpperCase();
        } else {
            newCastle += c.toLowerCase();
        }
    }

    newCastle = normalizeCastle(newCastle);

    parts[0] = moves.join("/");
    parts[2] = newCastle;

    return parts.join(" ");
}

function normalizeCastle(castle) {
    let order = ["K", "Q", "k", "q"];
    let result = "";

    for (let i = 0; i < order.length; i++) {
        if (castle.includes(order[i])) {
            result += order[i];
        }
    }

    return result || "-";
}

function reverse(moves) {
    moves.forEach((row, rowIndex) => {
        let array = row.split("");

        array.forEach((piece, colIndex) => {
            if (piece === piece.toLowerCase() && piece !== piece.toUpperCase()) {
                piece = piece.toUpperCase();
            } else if (piece === piece.toUpperCase() && piece !== piece.toLowerCase()) {
                piece = piece.toLowerCase();
            }
            array[colIndex] = piece;
        });

        array.reverse();
        moves[rowIndex] = array.join("");
    });

    return moves.reverse();
}

function reverseCastle(castle) {
    let array = castle.split("").reverse();

    array.forEach((c, i) => {
        if (c === c.toLowerCase() && c !== c.toUpperCase()) {
            array[i] = c.toUpperCase();
        } else if (c === c.toUpperCase() && c !== c.toLowerCase()) {
            array[i] = c.toLowerCase();
        }
    });
    return array.join("");
}