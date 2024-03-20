import '@testing-library/jest-dom';
import { uppercaseHelloWorld } from '../../src/utils/hello-world-helper';

describe('Hello world helper functions', () => {
  test('uppercase hello world', () => {
    const helloWorld = 'hello 🌏!';
    expect(uppercaseHelloWorld(helloWorld)).toBe('HELLO 🌏!');
  });
});
