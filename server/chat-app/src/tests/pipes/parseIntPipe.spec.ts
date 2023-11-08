import { ParseIntPipe } from 'src/utils/pipes/parseIntPipe';
import { BadRequestException } from '@nestjs/common';
describe('ParseIntPipe', () => {
  let parseIntPipe: ParseIntPipe;

  beforeEach(() => {
    parseIntPipe = new ParseIntPipe();
  });

  it('should be defined', () => {
    expect(parseIntPipe).toBeDefined();
  });

  it('should parse a valid integer string', () => {
    const value = '123';
    const metadata = {}; // Możesz dostosować metadata, jeśli to konieczne
    const result = parseIntPipe.transform(value, metadata as any);
    expect(result).toEqual(123);
  });

  it('should throw BadRequestException for an invalid integer string', () => {
    const value = 'abc'; // To jest nieprawidłowa wartość
    const metadata = {}; // Możesz dostosować metadata, jeśli to konieczne
    try {
      parseIntPipe.transform(value, metadata as any);
      // Oczekujemy, że rzuci wyjątek BadRequestException
      fail('Expected BadRequestException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
});
