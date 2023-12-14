import { Chance } from 'chance';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.entity';

type PropsOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private _categoryId: PropsOrFactory<Uuid> | undefined = undefined;
  private _name: PropsOrFactory<string> = (_index: number) =>
    this.chance.name();
  private _description: PropsOrFactory<string | null> = (_index: number) =>
    this.chance.paragraph();
  private _isActive: PropsOrFactory<boolean> = (_index: number) => true;
  private _createdAt: PropsOrFactory<Date> | undefined = undefined;

  private countObjects;
  private chance: Chance.Chance;

  static aCategory(): CategoryFakeBuilder {
    return new CategoryFakeBuilder<Category>();
  }

  static theCategories(countObjects: number): CategoryFakeBuilder<Category[]> {
    return new CategoryFakeBuilder<Category[]>(countObjects);
  }

  private constructor(countObjects: number = 1) {
    this.countObjects = countObjects;
    this.chance = Chance();
  }

  withUuid(uuid: PropsOrFactory<Uuid>): CategoryFakeBuilder<TBuild> {
    this._categoryId = uuid;
    return this;
  }

  withName(name: PropsOrFactory<string>): CategoryFakeBuilder<TBuild> {
    this._name = name;
    return this;
  }

  withDescription(
    description: PropsOrFactory<string | null>,
  ): CategoryFakeBuilder<TBuild> {
    this._description = description;
    return this;
  }

  activate(): CategoryFakeBuilder<TBuild> {
    this._isActive = true;
    return this;
  }

  deactivate(): CategoryFakeBuilder<TBuild> {
    this._isActive = false;
    return this;
  }

  withCreatedAt(createdAt: PropsOrFactory<Date>): CategoryFakeBuilder<TBuild> {
    this._createdAt = createdAt;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjects)
      .fill(undefined)
      .map((_, index) => {
        const category = new Category({
          categoryId: !this._categoryId
            ? undefined
            : this.callFactory(this._categoryId, index),
          name: this.callFactory(this._name, index),
          description: this.callFactory(this._description, index),
          isActive: this.callFactory(this._isActive, index),
          ...(this._createdAt && {
            createdAt: this.callFactory(this._createdAt, index),
          }),
        });
        return category;
      });
    return this.countObjects === 1 ? (categories[0] as any) : categories;
  }

  get categoryId(): Uuid {
    return this.getValue('categoryId');
  }

  get name(): string {
    return this.getValue('name');
  }

  get description(): string | null {
    return this.getValue('description');
  }

  get isActive(): boolean {
    return this.getValue('isActive');
  }

  get createdAt(): Date {
    return this.getValue('createdAt');
  }

  private getValue(prop: any) {
    const optional = ['categoryId', 'createdAt'];
    const privateProp = `_${prop}` as keyof this;

    if (optional.includes(prop) && !this[privateProp]) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropsOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
