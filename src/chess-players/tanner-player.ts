import { ChessPlayerFactory, ChessPlayer, EngineParameter } from './chess-player';
import { PromotionChoice, Square } from 'src/chess-types';
import { wait } from 'src/utils';

const Module = (globalThis as any).Module;

let bobbyAPIResolver: (a: any) => void;
let bobbyAPI: Promise<any> = new Promise(resolve => bobbyAPIResolver = resolve);
Module.onRuntimeInitialized = async _ => {
    bobbyAPIResolver({
        move: Module.cwrap('move', null, ['number', 'number', 'number', 'number']),
        askTanner: Module.cwrap('askTanner', 'number', []),
    });
};

const parameters = [] as const;

export const TannerPlayerFactory: ChessPlayerFactory<ChessPlayer, typeof parameters> = Object.assign(
    () => {
        return {
            name: 'Tanner (Bobby Trawler)',
            msStartTime: Infinity,
            msIncrement: 0,
            onMove: (from: Square, to: Square, promotionChoice?: PromotionChoice) => {
                bobbyAPI = bobbyAPI.then(api => {
                    api.move(
                        from.charCodeAt(0) - 'a'.charCodeAt(0),
                        from.charCodeAt(1) - '1'.charCodeAt(0),
                        to.charCodeAt(0) - 'a'.charCodeAt(0),
                        to.charCodeAt(1) - '1'.charCodeAt(0),
                    );
                    return api;
                });
            },
            makeMove: async (game: any) => {
                await wait(500);
                const move = (await bobbyAPI).askTanner(2_500_000);
                await wait(250);
                return {
                    from: 'abcdefgh'[Math.floor(move / 8 / 8 / 8)] + Math.floor(1 + move / 8 / 8 % 8),
                    to: 'abcdefgh'[Math.floor(move / 8 % 8)] + (1 + move % 8),
                    promotionChoice: 'q',
                } as any;
            },
        } as const;
    },
    {
        parameters: parameters,
        defaultValues: [] as any,
    }
);


