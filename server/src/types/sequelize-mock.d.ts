declare module 'sequelize-mock' {
  interface MockModel {
    id?: string;
    name?: string;
    description?: string;
    portion?: number;
    storageLocation?: string;
    storedDate?: Date;
    expiryDate?: Date;
    tags?: string[];
    consumed?: boolean;
    consumedDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;

    save(): Promise<any>;
    validate(): void;
    getDataValue(key: string): any;
    setDataValue(key: string, value: any): void;
    [key: string]: any;
  }

  interface MockModelStatic {
    build(attributes?: any): MockModel;
    create(attributes?: any): Promise<MockModel>;
    findOne(options?: any): Promise<MockModel | null>;
    findAll(options?: any): Promise<MockModel[]>;
    findByPk(id: any): Promise<MockModel | null>;
    update(attributes: any, options?: any): Promise<[number, MockModel[]]>;
    destroy(options?: any): Promise<number>;
    [key: string]: any;
  }

  interface SequelizeMockInstance {
    define(modelName: string, attributes: any, options?: any): MockModelStatic;
    model(modelName: string): MockModelStatic;
    import(path: string): MockModelStatic;
  }

  export default class SequelizeMock implements SequelizeMockInstance {
    constructor(database?: string, username?: string, password?: string, options?: any);
    define(modelName: string, attributes: any, options?: any): MockModelStatic;
    model(modelName: string): MockModelStatic;
    import(path: string): MockModelStatic;
  }
}