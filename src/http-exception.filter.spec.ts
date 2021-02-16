import { HttpExceptionFilter, HttpExceptionFilter2 } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined();
    expect(new HttpExceptionFilter2()).toBeDefined();
  });
});
