import { randomElement } from './utils';

describe('randomElement', () => {
    it('returns an element', () => {
        expect([1, 2, 3]).toContain(randomElement([1, 2, 3]));
    });
});
