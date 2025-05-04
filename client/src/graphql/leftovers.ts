import { gql } from "@apollo/client";

/**
 * Common fragment containing all leftover fields
 * Reused across queries to ensure consistent field selection
 */
export const LEFTOVER_FRAGMENT = gql`
  fragment LeftoverFields on Leftover {
    id
    name
    description
    portion
    storageLocation
    storedDate
    expiryDate
    tags
    consumed
    consumedDate
    createdAt
    updatedAt
  }
`;

/**
 * Query operations for retrieving leftover data
 */

// Fetches all leftovers with optional location filter
export const GET_LEFTOVERS = gql`
  query GetLeftovers($location: StorageLocation) {
    leftovers(location: $location) {
      ...LeftoverFields
    }
  }
  ${LEFTOVER_FRAGMENT}
`;

// Fetches a single leftover by its ID
export const GET_LEFTOVER = gql`
  query GetLeftover($id: ID!) {
    leftover(id: $id) {
      ...LeftoverFields
    }
  }
  ${LEFTOVER_FRAGMENT}
`;

/**
 * Mutation operations for modifying leftover data
 */

// Creates a new leftover item
export const CREATE_LEFTOVER = gql`
  mutation CreateLeftover($leftoverInput: LeftoverInput!) {
    createLeftover(leftoverInput: $leftoverInput) {
      ...LeftoverFields
    }
  }
  ${LEFTOVER_FRAGMENT}
`;

// Updates an existing leftover's properties
export const UPDATE_LEFTOVER = gql`
  mutation UpdateLeftover($id: ID!, $leftoverInput: LeftoverUpdateInput!) {
    updateLeftover(id: $id, leftoverInput: $leftoverInput) {
      ...LeftoverFields
    }
  }
  ${LEFTOVER_FRAGMENT}
`;

// Permanently removes a leftover
export const DELETE_LEFTOVER = gql`
  mutation DeleteLeftover($id: ID!) {
    deleteLeftover(id: $id)
  }
`;

// Marks a leftover as consumed with current timestamp
export const CONSUME_LEFTOVER = gql`
  mutation ConsumeLeftover($id: ID!) {
    consumeLeftover(id: $id) {
      ...LeftoverFields
    }
  }
  ${LEFTOVER_FRAGMENT}
`;

// Consumes a specific portion amount of a leftover
export const CONSUME_PORTION = gql`
  mutation ConsumePortion($id: ID!, $amount: Float!) {
    consumePortion(id: $id, amount: $amount) {
      ...LeftoverFields
    }
  }
  ${LEFTOVER_FRAGMENT}
`;
