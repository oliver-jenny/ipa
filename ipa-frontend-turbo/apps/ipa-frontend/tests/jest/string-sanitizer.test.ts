import '@testing-library/jest-dom';
import { sanitize } from '../../src/utils/string-sanitizer';

describe('String Sanitizer tests', () => {
  test('sanitize ampersand', () => {
    const input = 'This & that';
    expect(sanitize(input)).toBe('This &amp; that');
  });

  test('sanitize less than', () => {
    const input = '5 < 10';
    expect(sanitize(input)).toBe('5 &lt; 10');
  });

  test('sanitize greater than', () => {
    const input = 'x > y';
    expect(sanitize(input)).toBe('x &gt; y');
  });

  test('sanitize double quotes', () => {
    const input = 'He said "Hello"';
    expect(sanitize(input)).toBe('He said &quot;Hello&quot;');
  });

  test('sanitize single quotes', () => {
    const input = "I'm happy";
    expect(sanitize(input)).toBe('I&#x27;m happy');
  });

  test('sanitize slash', () => {
    const input = 'path/to/file';
    expect(sanitize(input)).toBe('path&#x2F;to&#x2F;file');
  });

  test('sanitize asterisk', () => {
    const input = 'a*b';
    expect(sanitize(input)).toBe('a&ast;b');
  });

  test('sanitize period', () => {
    const input = '1.5';
    expect(sanitize(input)).toBe('1&period;5');
  });
});
