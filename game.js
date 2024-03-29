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
        this.board[0][1] = new piece('N');
        this.board[0][2] = new piece('B');
        this.board[0][3] = new piece('Q');
        this.board[0][4] = new piece('K');
        this.board[0][5] = new piece('B');
        this.board[0][6] = new piece('N');
        this.board[0][7] = new piece('R');
        for (let i = 0; i<8; i++){
            this.board[1][i] = new piece('P');
            this.board[6][i] = new piece('p');
        }
        this.board[7][0] = new piece('r');
        this.board[7][1] = new piece('n');
        this.board[7][2] = new piece('b');
        this.board[7][3] = new piece('q');
        this.board[7][4] = new piece('k');
        this.board[7][5] = new piece('b');
        this.board[7][6] = new piece('n');
        this.board[7][7] = new piece('r');
        this.startgame()
    }
    getFEN() {
        string = "";
        let val = 0;
        for (let i = 7; i>=0; i--) {
            for (let j = 0; j<8; j++) {
                if (this.board[i][j] == null) {
                    val++;
                }
                else {
                    string += val;
                    val = 0;
                    string += this.board[i][j].pieceType;
                }
            }
            if (val != 0) {
                string += val;
            }
            string += "/";
        }
        string += " "
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
        return string;
    }

    startgame() { //should be done? not sure if it works though
        while (true) {
            //let input = prompt("Enter Move: ");
            this.move(input);
            if (this.turn) {
                this.turn = false;
            }
            else {
                this.turn = true;
            }
        }
        /*const input = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        input.question('Input move: ', ans => {
            if (ans == '') { this.startgame();}
            let res = ans.split(' ');
            
            if (!this.move(res)) {this.startgame();}
        if (this.turn) {
            this.turn = false;
        }
        else {
            this.turn = true;
        }
        this.printPos();
        this.startgame();
        })*/
        

    }
    printPos() { //Should work fine -- prints the boardstate in console
        let str = "";
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
        y1 = this.toInt(from[0]);
        x1 = this.toInt(from[1]);
        y2 = this.toInt(destination[0]);
        x2 = this.toInt(destination[1]);

        this.fromPiece = this.board[x1][y1];
        if (this.fromPiece.getColor() != this.turn) {
            return false;
        }
        if (this.board[x2][y2] != null) {
            if (this.board[x2][y2].getColor() == this.turn) {
                return false;
            }
        }
        var pMoves = fromPiece.possibleMoves(board, x1, y1);
        var stage2 = false;
        for (let i = 0; i <pMoves.length; i++) {
            if (pMoves[i][0] == x2 && pMoves[i][1] == y2) {
                stage2 = true;
            }
        }
        if (!stage2) {
            return false;
        }
        var castling = false;
        var passing = false;
        if ((this.fromPiece.pieceType == 'K' || this.fromPiece.pieceType == 'k') && Math.abs(x2-x1) == 2) { //Castling specifically
            if (x2 - x1 > 0) {
                if (this.fromPiece.pieceType == 'K') {
                    if (this.castle[0]) {
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (this.castle[2]) {
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                if (this.fromPiece.pieceType == 'K') {
                    if (this.castle[1]) {
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (this.castle[3]) {
                    }
                    else {
                        return false;
                    }
                }
            }
            castling = true;
        }
        if (this.fromPiece.pieceType == 'P' || this.fromPiece.pieceType == 'p') { //Pawn movements
            if (x1 != x2) {
                if (board[x2][y2] == null) {
                    if (enPassant[0] != x2 || enPassant[1] != y2) {
                        return false;
                    }
                    passing = true;
                }
            }
            if (board[x2][y2] != null) {
                return false;
            }
            if (Math.abs(y2-y1) > 1) {
                if (board[x2][Math.abs(y2+y1)/2] != null) {
                    return false;
                }
            }
        }
        var fakeBoard = this.board;
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
            fakeBoard[x2][y2-1] = null;
        }
        if (!this.checkDanger(fakeBoard)) {
            return false;
        }

        this.board = fakeBoard;
        if (castling) {
            if (this.turn) {
                castle[0] = false;
                castle[1] = false;
            }
            else {
                castle[2] = false;
                castle[3] = false;
            }
        }
        if ((this.fromPiece.pieceType == 'p' || this.fromPiece.pieceType == 'P') && y2-y1 > 1) {
            if (this.turn) {
                enpassant = [x2, y2-1];
            }
            else {
                enpassant = [x2, y2+1];
            }
        }
        else {
            enpassant = [-1, -1];
        }

        this.board[x2, y2].moved();
        if (castle[0] || castle[1]) {
            if (this.board[0][0] == null)  {
                castle[1] = false;
            }
            if (this.board[0][7] == null) {
                castle[0] = false;
            }
            if (this.board[0][4] == null) {
                castle[0] = false;
                castle[1] = false;
            }
        }
        if (castle[2] || castle[3]) {
            if (this.board[7][0] == null)  {
                castle[2] = false;
            }
            if (this.board[7][7] == null) {
                castle[3] = false;
            }
            if (this.board[7][4] == null) {
                castle[2] = false;
                castle[3] = false;
            }
        }
        
        for (let i = 0; i<this.board[0].length; i++) {
            if (this.board[0][i].pieceType == 'p') {
                this.board[0][i] = destination[4];
            }
            if (this.board[7][i].pieceType == 'P') {
                this.board[7][i] = desination[4];
            }
        }
        return true;

    } //next goal:debug

    checkDanger(tempBoard) {
        var x1 = -1;
        var y1 = -1;
        for (let i = 0; i<8; i++) {
            for (let j = 0; j< 8; j++) {
                if ((tempBoard[i][j].pieceType == 'k' || tempBoard[i][j].pieceType == 'K') && tempBoard[i][j].getColor() == this.turn) {
                    x1 = i;
                    y1 = j;
                }
            }
        }
        var knightMoves, bishopMoves, rookMoves, kingMoves;
        kingMoves = new piece('K').moved();
        kingMoves = kingMoves.possibleMoves(tempBoard, x1, y1);
        if (this.turn) {
            knightMoves = new piece('N').possibleMoves(board, x1, y1);
            bishopMoves = new piece('B').possibleMoves(board, x1, y1);
            rookMoves = new piece('R').possibleMoves(board, x1, y1);
            if (board[x-1][y+1].pieceType == 'p' || board[x+1][y+1].pieceType == 'p') {
                return false;
            }
        }
        else {
            knightMoves = new piece('n').possibleMoves(board, x1, y1);
            bishopMoves = new piece('b').possibleMoves(board, x1, y1);
            rookMoves = new piece('r').possibleMoves(board, x1, y1);
            if (board[x-1][y-1].pieceType == 'P' || board[x-1][y-1].pieceType == 'p') {
                return false;
            }
        }
        var square;
        for (let i = 0; i < knightMoves.length; i++) {
            square = board[knightMoves[i][0]][knightMoves[i][1]];
            if (square != null) {
                if (square.getColor() != this.turn) {
                    if (square.pieceType == 'N' || square.pieceType == 'n') {
                        return false;
                    }
                }
            }
        }
        for (let i = 0; i < bishopMoves.length; i++) {
            square = board[bishopMoves[i][0]][bishopMoves[i][1]];
            if (square != null) {
                if (square.getColor() != this.turn) {
                    if ((square.pieceType == 'B' || square.pieceType == 'b') || (square.pieceType == 'Q' || square.pieceType == 'q')) {
                        return false;
                    }
                }
            }
        }
        for (let i = 0; i < rookMoves.length; i++) {
            square = board[rookMoves[i][0]][rookMoves[i][1]];
            if (square != null) {
                if (square.getColor() != this.turn) {
                    if ((square.pieceType == 'R' || square.pieceType == 'r') || (square.pieceType == 'Q' || square.pieceType == 'q')) {
                        return false;
                    }
                }
            }
        }
        for (let i = 0; i < kingMoves.length; i++) {
            square = board[kingMoves[i][0]][kingMoves[i][1]];
            if (square != null) {
                if (square.getColor() != this.turn) {
                    if (square.pieceType == 'K' || square.pieceType == 'k')  {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
}

