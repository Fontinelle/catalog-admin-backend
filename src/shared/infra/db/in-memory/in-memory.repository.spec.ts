import { Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { InMemoryRepository } from './in-memory.repository';

type StubProps = {
  entityId?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entityId: Uuid;
  name: string;
  price: number;

  constructor(props: StubProps) {
    super();
    this.entityId = props.entityId ?? new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entityId: this.entityId.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository unit tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  describe('insert', () => {
    it('should insert an entity', async () => {
      const entity = new StubEntity({
        entityId: new Uuid(),
        name: 'Stub',
        price: 100,
      });
      await repository.insert(entity);

      expect(repository.items.length).toBe(1);
      expect(repository.items[0]).toEqual(entity);
    });
  });

  describe('bulkInsert', () => {
    it('should insert multiple entities', async () => {
      const entities = [
        new StubEntity({
          entityId: new Uuid(),
          name: 'Stub 1',
          price: 100,
        }),
        new StubEntity({
          entityId: new Uuid(),
          name: 'Stub 2',
          price: 200,
        }),
      ];
      await repository.bulkInsert(entities);

      expect(repository.items.length).toBe(2);
      expect(repository.items[0]).toEqual(entities[0]);
      expect(repository.items[1]).toEqual(entities[1]);
    });
  });

  describe('update', () => {
    it('should throw an error if entity does not exist', async () => {
      const entity = new StubEntity({
        entityId: new Uuid(),
        name: 'Stub',
        price: 100,
      });

      await expect(repository.update(entity)).rejects.toThrow(
        new NotFoundError(entity.entityId, StubEntity),
      );
    });

    it('should update an entity', async () => {
      const entity = new StubEntity({
        entityId: new Uuid(),
        name: 'Stub',
        price: 100,
      });
      await repository.insert(entity);

      const entityUpdated = new StubEntity({
        entityId: entity.entityId,
        name: 'Stub Updated',
        price: 200,
      });

      await repository.update(entityUpdated);

      expect(repository.items.length).toBe(1);
      expect(repository.items[0].entityId).toBe(entity.entityId);
      expect(repository.items[0].name).not.toBe(entity.name);
      expect(repository.items[0].price).not.toBe(entity.price);
      expect(repository.items[0].entityId).toBe(entityUpdated.entityId);
      expect(repository.items[0].name).toBe(entityUpdated.name);
      expect(repository.items[0].price).toBe(entityUpdated.price);
    });
  });

  describe('delete', () => {
    it('should throw an error if entity does not exist', async () => {
      const id = new Uuid();

      await expect(repository.delete(id)).rejects.toThrow(
        new NotFoundError(id, StubEntity),
      );
    });

    it('should delete an entity', async () => {
      const entity = new StubEntity({
        entityId: new Uuid(),
        name: 'Stub',
        price: 100,
      });
      await repository.insert(entity);

      await repository.delete(entity.entityId);
      const result = await repository.findById(entity.entityId);
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return null if entity does not exist', async () => {
      const id = new Uuid();
      const result = await repository.findById(id);
      expect(result).toBeNull();
    });

    it('should return an entity', async () => {
      const entity = new StubEntity({
        entityId: new Uuid(),
        name: 'Stub',
        price: 100,
      });
      await repository.insert(entity);
      const result = await repository.findById(entity.entityId);
      expect(result).toEqual(entity);
    });
  });

  describe('findAll', () => {
    it('should return an empty array if there are no entities', async () => {
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });

    it('should return an array of entities', async () => {
      const entities = [
        new StubEntity({
          entityId: new Uuid(),
          name: 'Stub 1',
          price: 100,
        }),
        new StubEntity({
          entityId: new Uuid(),
          name: 'Stub 2',
          price: 200,
        }),
      ];
      await repository.bulkInsert(entities);
      const result = await repository.findAll();
      expect(result).toEqual(entities);
    });
  });
});
