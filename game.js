import piece from './piece.js';

export default class Game {
    constructor() { //going to be in FEN format
        this.board = [];
        for (let i = 0; i<8; i++) {
            this.board.push([]);
            for (let j = 0; j<8; j++) {
                this.board[i].push(null);
            }
        }
        this.castle = [true, true, true, true]; //Castling order goes [K,Q,k,q]
        this.turn = true;
        this.enpassant = [-1, -1];
        this.halfmove = 0;
        this.fullmove = 1;
    }

    initialize() { //initializes new board state
        this.board[0][0] = new piece('R');
        this.board[1][0] = new piece('N');
        this.board[2][0] = new piece('B');
        this.board[3][0] = new piece('Q');
        this.board[4][0] = new piece('K');
        this.board[5][0] = new piece('B');
        this.board[6][0] = new piece('N');
        this.board[7][0] = new piece('R');
        for (let i = 0; i<8; i++){
            this.board[i][1] = new piece('P');
            this.board[i][6] = new piece('p');
        }
        this.board[0][7] = new piece('r');
        this.board[1][7] = new piece('n');
        this.board[2][7] = new piece('b');
        this.board[3][7] = new piece('q');
        this.board[4][7] = new piece('k');
        this.board[5][7] = new piece('b');
        this.board[6][7] = new piece('n');
        this.board[7][7] = new piece('r');
        this.startgame()
    }

    getFEN() {
        let string = "";
        let val = 0;
        for (let i = 7; i>=0; i--) {
            for (let j = 0; j<8; j++) {
                if (this.board[j][i] == null) {
                    val++;
                }
                else {
                    if (val != 0) {
                        string += val;
                        val = 0;
                    }
                    string += this.board[j][i].pieceType;
                    
                }
            }
            if (val != 0) {
                string += val;
                val = 0;
            }
            string += "/";
        }
        string = string.slice(0, -1);
        /*string += " "
        if (this.turn) {
            string += "w";
        }
        else {
            string += "b";
        }
        string += " ";
        val = 0;
        if (this.castle[0]) {
            string += "K";
            val++;
        }
        if (this.castle[1]) {
            string += "Q";
            val++;
        }
        if (this.castle[2]) {
            string += "k";
            val++;
        }
        if (this.castle[3]) {
            string += "q";
            val++;
        }
        if (val == 0) {
            string +="-";
        }
        string += " ";

        if (enpassant[0] == -1) {
            string+= "-";
        }
        else {
            string+= this.toChar(enpassant[0]);
            string+= enpassant[1];
        }
        string += " ";
        string += this.halfmove + " " + this.fullmove;
        */
       return string;
        
    }

    startgame() {
        /*while (true) {
            let input = prompt("Enter Move: ");
            this.move(input);
            if (this.turn) {
                this.turn = false;
            }
            else {
                this.turn = true;
            }
        }*/
    }

    enter(str) {
        str = str.split(" ");
        if (!this.move(str[0], str[1])) {
            console.log("move invalid");
            return false;
        }
        
        if (this.turn) {
            this.turn = false;
        }
        else {
            this.turn = true;
        }
    }

    printPos() { //Should work fine -- prints the boardstate in console
        for (let i = 7; i>=0; i--) {
            for (let j = 0; j<8; j++) {
                if (this.board[i][j] != null) {
                    console.log(this.board[i][j].pieceType + " ");
                }
                else {
                    console.log("  ");
                }
            }
        }
    }
    toInt(val) {
        let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (let i = 0; i<8; i++) {
            if (arr[i] == val)  {
                return i;
            }
        }
        return -1;
    }
    toChar(val) {
        let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return arr[val];
    }
    move(from, destination) { //from and destinations are Strings in [A1, H8]

        let y1 = from[1] - 1;
        let x1 = this.toInt(from[0]);
        let y2 = destination[1] - 1;
        let x2 = this.toInt(destination[0]);

        if (this.board[x1][y1] == null) {
            console.log("empty square");
            return false;
        }
        this.fromPiece = this.board[x1][y1];
        if (this.fromPiece.color != this.turn) {
            console.log("moving wrong coloured piece");
            return false;
        }
        if (this.board[x2][y2] != null) {
            if (this.board[x2][y2].color == this.turn) {
                console.log("capturing own piece");
                return false;
            }
        }
        var pMoves = this.fromPiece.possibleMoves(this.board, x1, y1);

        var stage2 = false;
        for (let i = 0; i <pMoves.length; i++) {
            if (pMoves[i][0] == x2 && pMoves[i][1] == y2) {
                stage2 = true;
            }
        }
        if (!stage2) {
            console.log("not legal move");
            return false;
        }
        var castling = false;
        var passing = false;
        if ((this.fromPiece.pieceType == 'K' || this.fromPiece.pieceType == 'k') && Math.abs(x2-x1) == 2) { //Castling specifically
            if (x2 - x1 > 0) {
                console.log(this.castle);
                if (this.fromPiece.pieceType == 'K') {
                    if (this.castle[0]) {
                    }
                    else {
                        console.log("castling invalid");
                        return false;
                    }
                }
                else {
                    if (this.castle[2]) {
                    }
                    else {
                        console.log("castling invalid");
                        return false;
                    }
                }
            }
            else {
                if (this.fromPiece.pieceType == 'K') {
                    if (this.castle[1]) {
                    }
                    else {
                        console.log("castling invalid");
                        return false;
                    }
                }
                else {
                    if (this.castle[3]) {
                    }
                    else {
                        console.log("castling invalid");
                        return false;
                    }
                }
            }
            castling = true;
        }
        if (this.fromPiece.pieceType == 'P' || this.fromPiece.pieceType == 'p') { //Pawn movements
            if (x1 != x2) {
                if (this.board[x2][y2] == null && this.enpassant != null) {
                    console.log(this.enpassant);
                    if (this.enpassant[0] != x2 || this.enpassant[1] != y2) {
                        console.log("invalid enpassant move");
                        return false;
                    }
                    passing = true;
                }
            }
            if (x1 == x2 && this.board[x2][y2] != null) {
                console.log("destination square occupied");
                return false;
            }
            if (Math.abs(y2-y1) > 1) {
                if (this.board[x1][Math.abs(y2+y1)/2] != null) {
                    console.log("moving too far or blocked");
                    return false;
                }
            }
        }
        let fakeBoard = [];
        for (let i = 0; i< 8; i++) {
            let temp = [];
            for (let j = 0; j<8; j++) {
                temp[j] = this.board[i][j];
            }
            fakeBoard[i] = temp;
        }
        if (castling) {
            if (x2 == 6) {
                fakeBoard[5][y1] = fakeBoard[x1][y1];
                fakeBoard[x1][y1] = null;
                if (!this.checkDanger(fakeBoard)) {
                    return false;
                }
                fakeBoard[x2][y2] = fakeBoard[5][y1];
                fakeBoard[5][y1] = fakeBoard[7][y1];
                fakeBoard[7][y1] = null;
            }
            else {
                fakeBoard[2][y1] = fakeBoard[x1][y1];
                fakeBoard[x1][y1] = null;
                if (!this.checkDanger(fakeBoard)) {
                    return false;
                }
                fakeBoard[x2][y2] = fakeBoard[2][y1];
                fakeBoard[3][y1] = fakeBoard[0][y1];
                fakeBoard[0][y1] = null;
            }
        }
        if (!castling) {
            fakeBoard[x2][y2] = fakeBoard[x1][y1];
            fakeBoard[x1][y1] = null;
        }
        if (passing) {
            if (this.turn) {
                fakeBoard[x2][y2-1] = null;
            }
            else {
                fakeBoard[x2][y2+1] = null;
            }
        }
        if (!this.checkDanger(fakeBoard)) {
            console.log("check stage 3");
            return false;
        }

        this.board = fakeBoard;
        if (castling) {
            if (this.turn) {
                this.castle[0] = false;
                this.castle[1] = false;
            }
            else {
                this.castle[2] = false;
                this.castle[3] = false;
            }
        }
        if ((this.fromPiece.pieceType == 'p' || this.fromPiece.pieceType == 'P') && Math.abs(y2-y1) > 1) {
            if (this.turn) {
                this.enpassant = [x2, y2-1];
            }
            else {
                this.enpassant = [x2, y2+1];
            }
        }
        else {
            this.enpassant = [-1, -1];
        }

        this.board[x2][y2].moved();
        if (this.castle[0] || this.castle[1]) {
            if (this.board[0][0] == null)  {
                this.castle[1] = false;
            }
            if (this.board[7][0] == null) {
                this.castle[0] = false;
            }
            if (this.board[4][0] == null) {
                this.castle[0] = false;
                this.castle[1] = false;
            }
        }
        if (this.castle[2] || this.castle[3]) {
            if (this.board[7][7] == null)  {
                this.castle[2] = false;
            }
            if (this.board[0][7] == null) {
                this.castle[3] = false;
            }
            if (this.board[4][7] == null) {
                this.castle[2] = false;
                this.castle[3] = false;
            }
        }
        
        for (let i = 0; i<this.board[0].length; i++) {
            if (this.board[i][0] != null) {
                if (this.board[i][0].pieceType == 'p') {
                    this.board[i][0] = new piece(destination[4]);
                    console.log(destination[4]);
                }
            }
            if (this.board[i][7] != null) {
                if (this.board[i][7].pieceType == 'P') {
                    this.board[i][7] = new piece(desination[4]);
                    console.log(destination[4]);
                }
            }
        }
        return true;

    } //next goal:debug

    checkDanger(tempBoard) {
        var x1 = -1;
        var y1 = -1;
        for (let i = 0; i<8; i++) {
            for (let j = 0; j< 8; j++) {
                if (tempBoard[i][j] != null) {
                    if ((tempBoard[i][j].pieceType == 'k' || tempBoard[i][j].pieceType == 'K') && tempBoard[i][j].color == this.turn) {
                        x1 = i;
                        y1 = j;
                    }
                }
            }
        }
        var knightMoves, bishopMoves, rookMoves, kingMoves;
        kingMoves = new piece('K');
        kingMoves.moved();
        
        kingMoves = kingMoves.possibleMoves(tempBoard, x1, y1);
        if (this.turn) {

            knightMoves = new piece('N').possibleMoves(tempBoard, x1, y1);
            bishopMoves = new piece('B').possibleMoves(tempBoard, x1, y1);
            rookMoves = new piece('R').possibleMoves(tempBoard, x1, y1);
            if (y1 < 7) {
                if (x1 > 0) {
                    if (tempBoard[x1-1][y1+1] != null) {
                        if (tempBoard[x1-1][y1+1].pieceType == 'p') {
                            return false;
                        }
                    }
                }
                if (x1 < 7) {
                    if (tempBoard[x1+1][y1+1] != null) {
                        if (tempBoard[x1+1][y1+1].pieceType == 'p') {
                            return false;
                        }
                    }
                }
            }
        }
        else {

            knightMoves = new piece('n').possibleMoves(tempBoard, x1, y1);
            bishopMoves = new piece('b').possibleMoves(tempBoard, x1, y1);
            rookMoves = new piece('r').possibleMoves(tempBoard, x1, y1);
            if (y1 > 0) {
                if (x1 > 0) {
                    if (tempBoard[x1-1][y1-1] != null) {
                        if (tempBoard[x1-1][y1-1].pieceType == 'P') {
                            return false;
                        }
                    }
                }
                if (x1 < 7) {
                    if (tempBoard[x1+1][y1-1] != null) {
                        if (tempBoard[x1+1][y1-1].pieceType == 'P') {
                            return false;
                        }
                    }
                }
            }
        }
        var square;

        for (let i = 0; i < knightMoves.length; i++) {
            square = tempBoard[knightMoves[i][0]][knightMoves[i][1]];
            if (square != null) {
                if (square.color != this.turn) {
                    if (square.pieceType == 'N' || square.pieceType == 'n') {
                        return false;
                    }
                }
            }
        }
        for (let i = 0; i < bishopMoves.length; i++) {
            square = tempBoard[bishopMoves[i][0]][bishopMoves[i][1]];
            if (square != null) {
                if (square.color != this.turn) {
                    if ((square.pieceType == 'B' || square.pieceType == 'b') || (square.pieceType == 'Q' || square.pieceType == 'q')) {
                        return false;
                    }
                }
            }
        }
        for (let i = 0; i < rookMoves.length; i++) {
            square = tempBoard[rookMoves[i][0]][rookMoves[i][1]];
            if (square != null) {
                if (square.color != this.turn) {
                    if ((square.pieceType == 'R' || square.pieceType == 'r') || (square.pieceType == 'Q' || square.pieceType == 'q')) {
                        return false;
                    }
                }
            }
        }
        for (let i = 0; i < kingMoves.length; i++) {
            square = tempBoard[kingMoves[i][0]][kingMoves[i][1]];
            if (square != null) {
                if (square.color != this.turn) {
                    if (square.pieceType == 'K' || square.pieceType == 'k')  {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
}

