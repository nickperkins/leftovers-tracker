import { expect, describe, it } from "@jest/globals";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql, printSchema } from "graphql";
import leftoverTypeDefs from "../../schemas/leftoverSchema";

// Define types for GraphQL introspection response
interface GraphQLType {
  name: string;
  kind: string;
  fields?: Array<{
    name: string;
    type: {
      kind: string;
      name?: string;
      ofType?: {
        name?: string;
        kind?: string;
      };
    };
    args?: Array<{
      name: string;
      type: {
        kind: string;
        name?: string;
        ofType?: {
          name?: string;
          kind?: string;
        };
      };
    }>;
  }>;
  enumValues?: Array<{
    name: string;
  }>;
}

interface IntrospectionQueryResult {
  __type?: GraphQLType;
  __schema?: {
    queryType: {
      fields: Array<{
        name: string;
        type: {
          kind: string;
          ofType?: {
            name?: string;
          };
        };
        args: Array<{
          name: string;
          type: {
            kind: string;
            name?: string;
            ofType?: {
              name?: string;
              kind?: string;
            };
          };
        }>;
      }>;
    };
    mutationType: {
      fields: Array<{
        name: string;
      }>;
    };
  };
}

describe("Leftover Schema", () => {
  // Create a simple executable schema
  const schema = makeExecutableSchema({
    typeDefs: leftoverTypeDefs,
  });

  // A simpler first test to verify the schema contains the expected types
  it("should contain necessary type definitions", () => {
    const schemaString = printSchema(schema);
    expect(schemaString).toContain('type Leftover');
    expect(schemaString).toContain('enum StorageLocation');
    expect(schemaString).toContain('input LeftoverInput');
    expect(schemaString).toContain('input LeftoverUpdateInput');
    expect(schemaString).toContain('type Query');
    expect(schemaString).toContain('type Mutation');
  });

  it("should define Leftover type with required fields", async () => {
    const query = `
      {
        __type(name: "Leftover") {
          name
          kind
          fields {
            name
            type {
              kind
              name
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      rootValue: {},
    });

    // Check for errors in the GraphQL response
    expect(result.errors).toBeUndefined();

    // Get the type info from the result data with proper typing
    const data = result.data as IntrospectionQueryResult | undefined;
    const typeInfo = data?.__type;

    expect(typeInfo).toBeDefined();
    expect(typeInfo?.name).toBe("Leftover");
    expect(typeInfo?.kind).toBe("OBJECT");

    // Get all field names
    const fields = typeInfo?.fields || [];
    const fieldNames = fields.map((f) => f.name);

    // Check required fields exist
    const requiredFields = ['id', 'name', 'portion', 'storageLocation', 'storedDate', 'expiryDate', 'consumed'];
    requiredFields.forEach(fieldName => {
      expect(fieldNames).toContain(fieldName);
    });

    // Check optional fields exist
    const optionalFields = ['description', 'tags', 'consumedDate', 'createdAt', 'updatedAt'];
    optionalFields.forEach(fieldName => {
      expect(fieldNames).toContain(fieldName);
    });

    // Verify non-nullable fields (they have kind: NON_NULL)
    requiredFields.forEach(fieldName => {
      const field = fields.find((f) => f.name === fieldName);
      expect(field?.type.kind).toBe("NON_NULL");
    });
  });

  it("should define StorageLocation as an enum with correct values", async () => {
    const query = `
      {
        __type(name: "StorageLocation") {
          name
          kind
          enumValues {
            name
          }
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      rootValue: {},
    });

    expect(result.errors).toBeUndefined();
    const data = result.data as IntrospectionQueryResult | undefined;
    const typeInfo = data?.__type;

    expect(typeInfo).toBeDefined();
    expect(typeInfo?.name).toBe("StorageLocation");
    expect(typeInfo?.kind).toBe("ENUM");

    const enumValues = typeInfo?.enumValues?.map((v) => v.name) || [];
    expect(enumValues).toContain("freezer");
    expect(enumValues).toContain("fridge");
    expect(enumValues).toHaveLength(2);
  });

  it("should define query operations correctly", async () => {
    const query = `
      {
        __schema {
          queryType {
            fields {
              name
              type {
                kind
                ofType {
                  name
                }
              }
              args {
                name
                type {
                  kind
                  name
                  ofType {
                    name
                    kind
                  }
                }
              }
            }
          }
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      rootValue: {},
    });

    expect(result.errors).toBeUndefined();
    const data = result.data as IntrospectionQueryResult | undefined;
    const queryFields = data?.__schema?.queryType.fields || [];
    const queryNames = queryFields.map((f) => f.name);

    expect(queryNames).toContain("leftovers");
    expect(queryNames).toContain("leftover");

    // Check that leftover query requires an ID
    const leftoverQuery = queryFields.find((f) => f.name === "leftover");
    expect(leftoverQuery?.args).toHaveLength(1);
    expect(leftoverQuery?.args[0].name).toBe("id");
    expect(leftoverQuery?.args[0].type.kind).toBe("NON_NULL");
    expect(leftoverQuery?.args[0].type.ofType?.name).toBe("ID");
  });

  it("should define mutations correctly", async () => {
    const query = `
      {
        __schema {
          mutationType {
            fields {
              name
            }
          }
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      rootValue: {},
    });

    expect(result.errors).toBeUndefined();
    const data = result.data as IntrospectionQueryResult | undefined;
    const mutationFields = data?.__schema?.mutationType.fields || [];
    const mutationNames = mutationFields.map((f) => f.name);

    const expectedMutations = [
      "createLeftover",
      "updateLeftover",
      "deleteLeftover",
      "consumeLeftover",
      "consumePortion"
    ];

    expectedMutations.forEach(mutation => {
      expect(mutationNames).toContain(mutation);
    });
  });
});
