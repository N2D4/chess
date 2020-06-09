import { Square, PromotionChoice } from '../chess-types';

type MoveHandler = (from: Square, to: Square, promotionChoice?: PromotionChoice) => void;

export type ChessPlayer = {
    name: string,
    msStartTime: number, // infinity is valid
    msIncrement: number,
    onMove: MoveHandler,
    moveEmitter: 'local' | ((handler: MoveHandler) => void),
};

export type EngineParameter = {
    caption: string,
    type: Readonly<['text'] | ['boolean'] | ['integer', number, number] | ['slider', number, number] | ['minutes-seconds']>,
};

type EngineParameterMapping = {
    'text': string,
    'boolean': boolean,
    'integer': number,
    'slider': number,
    'minutes-seconds': number,
};
// mapping over tuple types is severely limited in TS currently (see discussion on a related issue:
// https://github.com/microsoft/TypeScript/issues/27995)
// so we have the code here that might work once this limitation has been removed (depending on how it's dealt with),
// while also having TypeUnchecked so it works without any friction today
type ParameterValues<P extends readonly EngineParameter[]> = EngineParameterMapping[P[number]['type'][0]][]
                                                  & {[K in keyof P & number]: EngineParameterMapping[P[K]['type'][0]]};


type TypeUnchecked<T> = T | any;

export type ChessPlayerFactory<T extends ChessPlayer, P extends readonly EngineParameter[]> = {
    (...parameterValues: TypeUnchecked<ParameterValues<P>>): T,
    parameters: P,
    defaultValues: ParameterValues<P>,
};
