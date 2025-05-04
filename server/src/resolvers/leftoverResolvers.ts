import { Op } from "sequelize";
import Leftover from "../models/Leftover";

/**
 * Input type for creating a new leftover
 * All required fields match the GraphQL schema requirements
 */
interface LeftoverInput {
  name: string;
  description?: string;
  portion?: number;
  storageLocation: "freezer" | "fridge";
  expiryDate: string; // Timestamp string
  ingredients?: string[];
  tags?: string[];
}

/**
 * Input type for updating an existing leftover
 * All fields are optional for partial updates
 */
interface LeftoverUpdateInput {
  name?: string;
  description?: string;
  portion?: number;
  storageLocation?: "freezer" | "fridge";
  expiryDate?: string; // Timestamp string
  ingredients?: string[];
  tags?: string[];
  consumed?: boolean;
  consumedDate?: string; // Timestamp string
}

/**
 * GraphQL resolvers for Leftover entity
 * Handles queries and mutations for leftover data
 */
const leftoverResolvers = {
  Query: {
    /**
     * Retrieves all leftovers with optional location filter
     * Results are sorted by storage date (newest first)
     */
    leftovers: async (_: any, { location }: { location?: string }) => {
      try {
        if (location) {
          return await Leftover.findAll({
            where: { storageLocation: location },
            order: [["storedDate", "DESC"]],
          });
        }
        return await Leftover.findAll({
          order: [["storedDate", "DESC"]],
        });
      } catch (error) {
        throw new Error(`Failed to fetch leftovers: ${error}`);
      }
    },

    /**
     * Retrieves a single leftover by ID
     * Throws an error if the leftover is not found
     */
    leftover: async (_: any, { id }: { id: string }) => {
      try {
        const leftover = await Leftover.findByPk(id);
        if (!leftover) {
          throw new Error(`Leftover with ID ${id} not found`);
        }
        return leftover;
      } catch (error) {
        throw new Error(`Failed to fetch leftover: ${error}`);
      }
    },
  },

  /**
   * Field resolvers to transform date fields to timestamp strings for GraphQL
   * This ensures consistent date handling between client and server
   */
  Leftover: {
    storedDate: (parent: any) => parent.storedDate.getTime().toString(),
    expiryDate: (parent: any) => parent.expiryDate.getTime().toString(),
    consumedDate: (parent: any) =>
      parent.consumedDate ? parent.consumedDate.getTime().toString() : null,
    createdAt: (parent: any) =>
      parent.createdAt ? parent.createdAt.getTime().toString() : null,
    updatedAt: (parent: any) =>
      parent.updatedAt ? parent.updatedAt.getTime().toString() : null,
  },

  Mutation: {
    /**
     * Creates a new leftover item with current storage date
     * Validates date formats and applies default values as needed
     */
    createLeftover: async (
      _: any,
      { leftoverInput }: { leftoverInput: LeftoverInput }
    ) => {
      try {
        // Parse and validate the dates
        const expiryDate = new Date(Number(leftoverInput.expiryDate));
        const storedDate = new Date();

        // Validate expiry date
        if (isNaN(expiryDate.getTime())) {
          throw new Error("Invalid expiry date format");
        }

        const newLeftover = await Leftover.create({
          ...leftoverInput,
          expiryDate,
          storedDate,
          portion: leftoverInput.portion ?? 1,
          consumed: false,
        });

        return newLeftover;
      } catch (error) {
        throw new Error(`Failed to create leftover: ${error}`);
      }
    },

    /**
     * Updates an existing leftover with partial data
     * Converts string timestamps to Date objects for storage
     */
    updateLeftover: async (
      _: any,
      { id, leftoverInput }: { id: string; leftoverInput: LeftoverUpdateInput }
    ) => {
      try {
        const leftover = await Leftover.findByPk(id);

        if (!leftover) {
          throw new Error(`Leftover with ID ${id} not found`);
        }

        const updateData = {
          ...leftoverInput,
          expiryDate: leftoverInput.expiryDate
            ? new Date(Number(leftoverInput.expiryDate))
            : undefined,
          consumedDate: leftoverInput.consumedDate
            ? new Date(Number(leftoverInput.consumedDate))
            : undefined,
        };

        await leftover.update(updateData);
        return leftover;
      } catch (error) {
        throw new Error(`Failed to update leftover: ${error}`);
      }
    },

    /**
     * Permanently deletes a leftover by ID
     * Returns true on success, false if nothing was deleted
     */
    deleteLeftover: async (_: any, { id }: { id: string }) => {
      try {
        const result = await Leftover.destroy({
          where: { id },
        });
        return result > 0;
      } catch (error) {
        throw new Error(`Failed to delete leftover: ${error}`);
      }
    },

    /**
     * Marks a leftover as consumed with the current timestamp
     * Simplified alternative to manual update
     */
    consumeLeftover: async (_: any, { id }: { id: string }) => {
      try {
        const leftover = await Leftover.findByPk(id);

        if (!leftover) {
          throw new Error(`Leftover with ID ${id} not found`);
        }

        await leftover.update({
          consumed: true,
          consumedDate: new Date(),
        });

        return leftover;
      } catch (error) {
        throw new Error(`Failed to consume leftover: ${error}`);
      }
    },

    /**
     * Consumes a specific portion amount of a leftover
     * Decreases the portion value and marks as fully consumed if portion reaches zero
     */
    consumePortion: async (
      _: any,
      { id, amount }: { id: string; amount: number }
    ) => {
      try {
        const leftover = await Leftover.findByPk(id);

        if (!leftover) {
          throw new Error(`Leftover with ID ${id} not found`);
        }

        if (amount <= 0) {
          throw new Error("Consumption amount must be greater than zero");
        }

        // Calculate new portion value
        const newPortion = Math.max(0, leftover.portion - amount);

        // Determine if fully consumed
        const isFullyConsumed = newPortion === 0;

        // Update the leftover record
        await leftover.update({
          portion: newPortion,
          consumed: isFullyConsumed,
          // Set consumed date only if fully consumed
          consumedDate: isFullyConsumed ? new Date() : leftover.consumedDate,
        });

        return leftover;
      } catch (error) {
        throw new Error(`Failed to consume portion: ${error}`);
      }
    },
  },
};

export default leftoverResolvers;
