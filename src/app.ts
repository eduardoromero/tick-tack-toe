class BoardRenderer {
    public static render(board: Board) {
        board.forEach(row => {
            const row_drawing = row.map(c => c.value || '□').join('|');
            console.log(row_drawing);
        });
    }
}

type Cell = {
    value: GameBoardValue;
    column: number,
    row: number,
}

export type Marks = 'x' | 'o';

export type GameBoardValue = Marks | undefined

export type GameState = {
    winner: GameBoardValue;
    matchEnded: boolean;
}

export type Board = Cell[][];

export class TicTacToeEngine {
    private rows: Cell[][] = []
    private winner: GameBoardValue;
    private moveCounter = 0;
    private matchEnded = false;

    public constructor() {
        this.rows[0] = [
            {value: undefined, row: 0, column: 0},
            {
                value: undefined,
                row: 0,
                column: 1
            }, {
                value: undefined,
                row: 0,
                column: 2
            }];
        this.rows[1] = [
            {value: undefined, row: 1, column: 0},
            {
                value: undefined,
                row: 1,
                column: 1
            }, {
                value: undefined,
                row: 1,
                column: 2
            }];
        this.rows[2] = [
            {value: undefined, row: 2, column: 0},
            {
                value: undefined,
                row: 2,
                column: 1
            }, {
                value: undefined,
                row: 2,
                column: 2
            }];
    }

    mark(value: Marks, row, column): GameState {
        const target = this.rows[row][column] || undefined;

        if (value === undefined) {
            throw new Error(`Invalid mark, please try again.`);
        }

        if (target === undefined || target.value !== undefined) {
            throw new Error(`${row}, ${column} is an invalid position.`)
        }

        target.value = value;
        if (this.checkMatchStatus(target)) {
            this.winner = value;
            this.matchEnded = true;
        }

        // board is full ?
        this.moveCounter++;

        if (this.moveCounter === this.rows.length * this.rows.length) {
            this.matchEnded = true;
        }

        return {
            winner: this.winner,
            matchEnded: this.matchEnded,
        }
    }

    // shallow copy of the status, readonly state effectively;)
    getMatchState() {
        return [...this.rows];
    }

    checkMatchStatus(target: Cell) {
        const {row, column, value} = target;

        // vertical
        let won = true;
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[row][i].value !== value) {
                won = false;
                break;
            }
        }

        if (won) {
            return true;
        }
        // horizontal
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i][column].value !== value) {
                won = false;
                break;
            }
        }
        if (won) {
            return true;
        }

        // across
        let win_r = true, win_l = true;
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i][i].value !== value) {
                win_r = false;
            }

            const d = this.rows.length - 1 - i;
            if (this.rows[d][i].value !== value) {
                win_l = false;
            }
        }

        return win_l || win_r;
        // [0,0] [1, 1] [2, 2]
        // [2,0] [1, 1] [0, 2]
    }
}

// new game!
const game = new TicTacToeEngine();

BoardRenderer.render(game.getMatchState());

console.log(game.mark('x', 0, 0));
BoardRenderer.render(game.getMatchState());

console.log(game.mark('o', 2, 0));
BoardRenderer.render(game.getMatchState());

console.log(game.mark('x', 0, 1));
BoardRenderer.render(game.getMatchState());

console.log(game.mark('o', 1, 1));
BoardRenderer.render(game.getMatchState());

console.log(game.mark('x', 0, 2));
BoardRenderer.render(game.getMatchState());
