import { InvalidUuidError, Uuid } from './uuid.vo';
import { validate as uuidValidate } from 'uuid';

describe('UUID unit tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

  it('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrow(InvalidUuidError);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a valid uuid', () => {
    // Arrange
    const uuid = new Uuid();

    // Assert
    expect(uuid).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it('should create a valid uuid from string', () => {
    // Arrange
    const uuid = new Uuid('c4e0e7e0-9c6a-4b9e-8b7a-5b7b8b5b7b8b');

    // Assert
    expect(uuid).toBeDefined();
    expect(uuid.id).toBe('c4e0e7e0-9c6a-4b9e-8b7a-5b7b8b5b7b8b');
    expect(uuidValidate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
