import EventEmitter from "events";

class BoardRenderer {
    public subscribe(emitter: EventEmitter) {
        emitter.on(events.GAME_UPDATED, (event) => {
            const {board} = event;

            BoardRenderer.render(board);
            console.log()
        });

        emitter.on(events.BOARD_FULL, () => BoardRenderer.tie());
        emitter.on(events.WINNER, (winner) => BoardRenderer.win(winner));
    }

    public static tie() {
        console.log("🤷");
    }

    public static win(winner) {
        console.log('====== winner ======')
        console.log(`🎉🎉🎉 ${winner} 🎉🎉🎉`);
    }

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

enum events {
    GAME_UPDATED = 'GAME_UPDATED',
    BOARD_FULL = 'BOARD_FULL',
    WINNER = 'WINNER',
}

export class TicTacToeEngine extends EventEmitter {
    private rows: Cell[][] = []
    private winner: GameBoardValue;
    private moveCounter = 0;
    private matchEnded = false;

    public constructor(size: number = 3) {
        super();

        new Array(3).fill([]).forEach((r, x) => {
            for (let y = 0; y < size; y++) {
                if (!this.rows[x]) {
                    this.rows[x] = [];
                }

                this.rows[x][y] = {value: undefined, row: x, column: y};
            }
        });
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

        this.moveCounter++;
        this.emit(events.GAME_UPDATED, {moves: this.moveCounter, state: this.getState(), board: this.getMatchState()});

        if (this.winner) {
            this.emit(events.WINNER, this.winner);
        }

        // board is full ?
        if (this.moveCounter === this.rows.length * this.rows.length) {
            this.matchEnded = true;
            this.emit(events.BOARD_FULL, {state: this.getState()});
        }

        return this.getState();
    }

    getState() {
        return {
            winner: this.winner,
            matchEnded: this.matchEnded,
        };
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

const renderer = new BoardRenderer();
renderer.subscribe(game);

// diagonal X wins
// game.mark('x', 0, 0);
// game.mark('o', 1, 0);
// game.mark('x', 1, 1);
// game.mark('o', 0, 2);
// game.mark('x', 2, 2);

// the other diagonal X wins
// game.mark('x', 0, 2);
// game.mark('o', 2, 2);
// game.mark('x', 1, 1);
// game.mark('o', 0, 0);
// game.mark('x', 2, 0);


game.mark('x', 0, 0);
game.mark('o', 1, 0);
game.mark('x', 0, 1);
game.mark('o', 0, 2);
game.mark('x', 2, 0);
game.mark('o', 1, 1);
game.mark('x', 1, 2);
game.mark('o', 2, 2);
game.mark('x', 2, 1);
