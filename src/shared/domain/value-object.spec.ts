import { ValueObject } from './value-object';

class TestValueObject extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(
    public readonly value: string,
    public readonly otherValue: number,
  ) {
    super();
  }
}

describe('ValueObject unit tests', () => {
  it('should be equal', () => {
    const valueObject1 = new TestValueObject('test');
    const valueObject2 = new TestValueObject('test');

    expect(valueObject1.equals(valueObject2)).toBe(true);

    const complexValueObject1 = new ComplexValueObject('test', 1);
    const complexValueObject2 = new ComplexValueObject('test', 1);

    expect(complexValueObject1.equals(complexValueObject2)).toBe(true);
  });

  it('should not be equal', () => {
    const valueObject1 = new TestValueObject('test');
    const valueObject2 = new TestValueObject('test2');

    expect(valueObject1.equals(valueObject2)).toBe(false);

    const complexValueObject1 = new ComplexValueObject('test', 1);
    const complexValueObject2 = new ComplexValueObject('test', 2);

    expect(complexValueObject1.equals(complexValueObject2)).toBe(false);
    expect(complexValueObject1.equals(valueObject1 as any)).toBe(false);
  });

  it('should not be equal to null', () => {
    const valueObject1 = new TestValueObject('test');

    expect(valueObject1.equals(null as any)).toBe(false);
  });

  it('should not be equal to undefined', () => {
    const valueObject1 = new TestValueObject('test');

    expect(valueObject1.equals(undefined as any)).toBe(false);
  });
});
