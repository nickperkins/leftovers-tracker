/**
 * GraphQL Schema definitions for the Leftover entity
 * Defines types, inputs, queries and mutations for leftover tracking
 */
import { gql } from "apollo-server-express";

const leftoverTypeDefs = gql`
  """
  Leftover food item representation
  Core entity for tracking stored food items with expiration dates
  """
  type Leftover {
    id: ID!
    name: String!
    description: String
    portion: Float!
    storageLocation: StorageLocation!
    storedDate: String! # ISO timestamp as string for client compatibility
    expiryDate: String! # ISO timestamp as string for client compatibility
    tags: [String]
    consumed: Boolean!
    consumedDate: String # ISO timestamp, null if not yet consumed
    createdAt: String
    updatedAt: String
  }

  """
  Available storage locations for leftover items
  """
  enum StorageLocation {
    freezer
    fridge
  }

  """
  Input for creating new leftover items
  Only essential fields are required, others have defaults
  """
  input LeftoverInput {
    name: String!
    description: String
    portion: Float
    storageLocation: StorageLocation!
    expiryDate: String! # Expected as millisecond timestamp
    tags: [String]
  }

  """
  Input for updating existing leftover items
  All fields optional for partial updates
  """
  input LeftoverUpdateInput {
    name: String
    description: String
    portion: Float
    storageLocation: StorageLocation
    expiryDate: String
    tags: [String]
    consumed: Boolean
    consumedDate: String
  }

  """
  Query operations for retrieving leftover data
  """
  type Query {
    """
    Retrieve all leftovers with optional location filter
    Returns sorted list with newest items first
    """
    leftovers(location: StorageLocation): [Leftover!]!

    """
    Retrieve a specific leftover by its unique ID
    Returns null if the ID doesn't exist
    """
    leftover(id: ID!): Leftover
  }

  """
  Mutation operations for modifying leftover data
  """
  type Mutation {
    """
    Create a new leftover with current timestamp as storage date
    """
    createLeftover(leftoverInput: LeftoverInput!): Leftover!

    """
    Update an existing leftover's properties
    Allows partial updates with only changed fields
    """
    updateLeftover(id: ID!, leftoverInput: LeftoverUpdateInput!): Leftover!

    """
    Permanently delete a leftover
    Returns true if successful, false if leftover not found
    """
    deleteLeftover(id: ID!): Boolean!

    """
    Mark a leftover as consumed with the current timestamp
    Simplified alternative to updateLeftover for this common action
    """
    consumeLeftover(id: ID!): Leftover!
  }
`;

export default leftoverTypeDefs;
