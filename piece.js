
export default class piece {
    constructor(pieceType) {
        this.pieceType = pieceType;
        if (this.lowercase(pieceType) == pieceType) {
            this.color = false;
        }
        else {
            this.color = true;
        }
        this.hasMoved = false;
    }


    moved() {
        this.hasMoved = true;
    }
    possibleMoves(board, x, y) {
        let temp = [];
        if (this.pieceType == 'K' || this.pieceType == 'k') {
            temp = [[x-1, y+1], [x, y+1], [x+1, y+1], [x-1, y], [x+1, y], [x-1, y-1], [x, y-1], [x+1, y-1]];
            if (!this.hasMoved) {
                if (board[x+1][y] == null && board[x+2][y] == null) {
                    temp.push([x+2, y]);
                }
                if (board[x-1][y] == null && board[x-2][y] == null && board[x-3][y] == null) {
                    temp.push([x-2, y]);
                }
            }
        }
        if (this.pieceType == 'B' || this.pieceType == 'b' || this.pieceType == 'Q' || this.pieceType == 'q') {
            var x1 = x;
            var y1 = y;
            let square = [];
            while (x1 > 0 && y1 < 7) {
                x1--;
                y1++;
                square = [x1, y1];
                if (board[x1][y1] == null) {
                    temp.push(square);
                }
                else {
                    if (board[x][y] != null) {
                        if (board[x1][y1].color != board[x][y].color) {
                            temp.push(square);
                        }
                    }
                    break;
                }
            }
            x1 = x;
            y1 = y;
            while (x1 < 7 && y1 < 7) {
                x1++;
                y1++;
                square = [x1, y1];
                if (board[x1][y1] == null) {
                    temp.push(square);
                }
                else {
                    if (board[x][y] != null) {
                        if (board[x1][y1].color != board[x][y].color) {
                            temp.push(square);
                        }
                    }
                    break;
                }
            }
            x1 = x;
            y1 = y;
            while (x1 < 7 && y1 > 0) {
                x1++;
                y1--;
                square = [x1, y1];
                if (board[x1][y1] == null) {
                    temp.push(square);
                }
                else {
                    if (board[x][y] != null) {
                        if (board[x1][y1].color != board[x][y].color) {
                            temp.push(square);
                        }
                    }
                    break;
                }
            }
            x1 = x;
            y1 = y;
            while (x1 > 0 && y1 > 0) {
                x1--;
                y1--;
                square = [x1, y1];
                if (board[x1][y1] == null) {
                    temp.push(square);
                    
                }
                else {
                    if (board[x][y] != null) {
                        if (board[x1][y1].color != board[x][y].color) {
                            temp.push(square);
                        }
                    }
                    break;
                }
            }
        }
        if (this.pieceType == 'N' || this.pieceType == 'n') {
            temp = [[x-2, y+1], [x-2,y-1], [x-1,y+2], [x-1,y-2], [x+1,y+2], [x+1,y-2], [x+2,y+1], [x+2,y-1]];
        }
        if (this.pieceType == 'R' || this.pieceType == 'r' || this.pieceType == 'Q' || this.pieceType == 'q') {
            var x1 = x;
            var y1 = y;
            let square = [];
            while (x1 > 0) {
                x1--;
                square = [x1, y1];
                if (board[x1][y1] == null) {
                    temp.push(square);
                }
                else {
                    if (board[x][y] != null) {
                        if (board[x1][y1].color != board[x][y].color) {
                            temp.push(square);
                        }
                    }
                    break;
                }
            }
            x1 = x;
            y1 = y;
            while (x1 < 7) {
                x1++;
                square = [x1, y1];
                if (board[x1][y1] == null) {
                    temp.push(square);

                }
                else {
                    if (board[x][y] != null) {
                        if (board[x1][y1].color != board[x][y].color) {
                            temp.push(square);
                            
                        }
                    }
                    break;
                }
            }
            x1 = x;
            y1 = y;
            while (y1 < 7) {
                y1++;
                square = [x1, y1];
                if (board[x1][y1] == null) {
                    temp.push(square);
                    
                }
                else {
                    if (board[x][y] != null) {
                        if (board[x1][y1].color != board[x][y].color) {
                            temp.push(square);
                            
                        }
                    }
                    break;
                }
            }
            y1 = y;
            x1 = x;
            while (y1 > 0) {
                y1--;
                square = [x1, y1];
                if (board[x1][y1] == null) {
                    temp.push(square);
                    
                }
                else {
                    if (board[x][y] != null) {
                        if (board[x1][y1].color != board[x][y].color) {
                            temp.push(square);
                            
                        }
                    }
                    break;
                }
            }
        }
        if (this.pieceType == 'P') {
            if (this.hasMoved == false) {
                temp = [[x,y+1], [x,y+2], [x+1, y+1], [x-1, y+1]];
            }
            else {
                temp = [[x, y+1], [x+1, y+1], [x-1, y+1]];
            }
        }
        if (this.pieceType == 'p') {
            if (this.hasMoved == false) {
                temp = [[x, y-1], [x, y-2], [x+1, y-1], [x-1, y-1]];
            }
            else {
                temp = [[x, y-1], [x+1, y-1], [x-1, y-1]];
            }
        }
        let arr = [];
        for (let i = 0; i< temp.length; i++) {
            if ((temp[i][0] < 0 || temp[i][0] > 7) || (temp[i][1] < 0 || temp[i][1] > 7)) {
            }
            else {
                arr.push(temp[i]);
                console.log(this.toChar(temp[i][0]) + " " + (temp[i][1]+1));
                
            }
        }
        console.log(this.pieceType);
        return arr;
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

    lowercase(letter) {
        let result = letter.toLowerCase();
        return result;
    }
}

