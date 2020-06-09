import { ChessPlayerFactory, ChessPlayer } from './chess-player';

const parameters = [
    {
        caption: 'Name',
        type: ['text'],
    },
    {
        caption: 'Time',
        type: ['minutes-seconds'],
    },
    {
        caption: 'Increment',
        type: ['minutes-seconds'],
    },
] as const;

export const LocalPlayerFactory: ChessPlayerFactory<ChessPlayer, typeof parameters> = Object.assign(
    (name: string, msTime: number, msIncrement: number) => ({
        name: name,
        msStartTime: msTime,
        msIncrement: msIncrement,
        onMove: () => {},
        moveEmitter: 'local',
    } as const),
    {
        parameters: parameters,
        defaultValues: [
            'Player',
            600_000,
            5000,
        ],
    }
);