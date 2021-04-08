import { ChessPlayerFactory, ChessPlayer, EngineParameter } from './chess-player';
import { PromotionChoice, Square } from 'src/chess-types';
import { wait } from 'src/utils';

const Chess = (globalThis as any).Chess;


const parameters = [] as const;

export const RandomizerPlayerFactory: ChessPlayerFactory<ChessPlayer, typeof parameters> = Object.assign(
    () => {
        const moveHandlers = [];
        return {
            name: 'Randomizer',
            msStartTime: Infinity,
            msIncrement: 0,
            onMove: () => {},
            makeMove: async (game: any) => {
                const moves = game.moves({verbose: true});
                if (moves.length <= 0) {
                    return;
                }
                const move = moves[Math.floor(Math.random() * moves.length)];
                await wait(100);
                return move;
            },
        } as const;
    },
    {
        parameters: parameters,
        defaultValues: [] as any,
    }
);


