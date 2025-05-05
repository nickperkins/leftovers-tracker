import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Leftover, { LeftoverAttributes } from "../../models/Leftover";
import leftoverResolvers from "../../resolvers/leftoverResolvers";

jest.mock("../../models/Leftover", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
}));

type MockedLeftover = Partial<LeftoverAttributes> & {
  update?: jest.Mock;
  destroy?: jest.Mock;
  getTime?: () => number;
};

describe("Leftover Resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Queries", () => {
    it("should fetch all leftovers", async () => {
      const mockLeftovers: MockedLeftover[] = [
        {
          id: "1",
          name: "Test 1",
          storedDate: new Date(),
          expiryDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "2",
          name: "Test 2",
          storedDate: new Date(),
          expiryDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      (Leftover.findAll as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockLeftovers)
      );

      const result = await leftoverResolvers.Query.leftovers(null, {});
      expect(result).toHaveLength(2);
      expect(Leftover.findAll).toHaveBeenCalled();
    });

    it("should fetch leftovers with location filter", async () => {
      const mockLeftovers: MockedLeftover[] = [
        {
          id: "1",
          name: "Test 1",
          storageLocation: "fridge",
          storedDate: new Date(),
          expiryDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      (Leftover.findAll as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockLeftovers)
      );

      const result = await leftoverResolvers.Query.leftovers(null, { location: "fridge" });
      expect(result).toHaveLength(1);
      expect(Leftover.findAll).toHaveBeenCalledWith({
        where: { storageLocation: "fridge" },
        order: [["storedDate", "DESC"]]
      });
    });

    it("should fetch a single leftover by ID", async () => {
      const mockLeftover: MockedLeftover = {
        id: "test-id",
        name: "Test Item",
        storedDate: new Date(),
        expiryDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockLeftover)
      );

      const result = await leftoverResolvers.Query.leftover(null, {
        id: "test-id",
      });
      expect(result).toEqual(mockLeftover);
      expect(Leftover.findByPk).toHaveBeenCalledWith("test-id");
    });

    it("should throw error for non-existent ID", async () => {
      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(null)
      );

      await expect(
        leftoverResolvers.Query.leftover(null, { id: "non-existent-id" })
      ).rejects.toThrow("Leftover with ID non-existent-id not found");
    });

    it("should handle database errors in queries", async () => {
      (Leftover.findAll as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error("Database connection failed"))
      );

      await expect(
        leftoverResolvers.Query.leftovers(null, {})
      ).rejects.toThrow("Failed to fetch leftovers");
    });
  });

  describe("Field Resolvers", () => {
    it("should format date fields correctly", () => {
      const now = new Date();
      const timestamp = now.getTime();

      const mockLeftover = {
        storedDate: now,
        expiryDate: now,
        consumedDate: now,
        createdAt: now,
        updatedAt: now,
      };

      // Test each date field resolver
      expect(leftoverResolvers.Leftover.storedDate(mockLeftover)).toBe(timestamp.toString());
      expect(leftoverResolvers.Leftover.expiryDate(mockLeftover)).toBe(timestamp.toString());
      expect(leftoverResolvers.Leftover.consumedDate(mockLeftover)).toBe(timestamp.toString());
      expect(leftoverResolvers.Leftover.createdAt(mockLeftover)).toBe(timestamp.toString());
      expect(leftoverResolvers.Leftover.updatedAt(mockLeftover)).toBe(timestamp.toString());
    });

    it("should handle null date fields", () => {
      const mockLeftover = {
        storedDate: new Date(),
        expiryDate: new Date(),
        consumedDate: null,
        createdAt: null,
        updatedAt: null,
      };

      expect(leftoverResolvers.Leftover.consumedDate(mockLeftover)).toBeNull();
      expect(leftoverResolvers.Leftover.createdAt(mockLeftover)).toBeNull();
      expect(leftoverResolvers.Leftover.updatedAt(mockLeftover)).toBeNull();
    });
  });

  describe("Mutations", () => {
    it("should create a new leftover", async () => {
      const timestamp = Date.now();
      const leftoverInput = {
        name: "New Leftover",
        storageLocation: "fridge" as const,
        expiryDate: timestamp.toString(),
        portion: 1,
      };

      const mockCreated: MockedLeftover = {
        id: "new-id",
        ...leftoverInput,
        expiryDate: new Date(timestamp),
        storedDate: new Date(),
        consumed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (Leftover.create as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockCreated)
      );

      const result = await leftoverResolvers.Mutation.createLeftover(null, {
        leftoverInput,
      });

      expect(result).toEqual(mockCreated);
      expect(Leftover.create).toHaveBeenCalledWith({
        ...leftoverInput,
        expiryDate: expect.any(Date),
        storedDate: expect.any(Date),
        portion: 1,
        consumed: false,
      });
    });

    it("should validate expiry date format", async () => {
      const invalidInput = {
        name: "Test",
        storageLocation: "fridge" as const,
        expiryDate: "invalid-date",
      };

      await expect(
        leftoverResolvers.Mutation.createLeftover(null, { leftoverInput: invalidInput })
      ).rejects.toThrow("Invalid expiry date");
    });

    it("should update an existing leftover", async () => {
      const updateInput = { name: "Updated Name", portion: 2 };
      const mockInstance: MockedLeftover = {
        id: "test-id",
        name: "Original Name",
        portion: 1,
        storedDate: new Date(),
        expiryDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        update: jest.fn().mockImplementation(function(this: MockedLeftover) {
          this.name = updateInput.name;
          this.portion = updateInput.portion;
          return Promise.resolve(this);
        }),
      };

      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockInstance)
      );

      const result = await leftoverResolvers.Mutation.updateLeftover(null, {
        id: "test-id",
        leftoverInput: updateInput,
      });

      expect(mockInstance.update).toHaveBeenCalledWith({
        ...updateInput,
        expiryDate: undefined,
        consumedDate: undefined
      });
      expect(result).toBe(mockInstance);
    });

    it("should delete a leftover", async () => {
      (Leftover.destroy as jest.Mock).mockImplementation(() =>
        Promise.resolve(1)
      );

      const result = await leftoverResolvers.Mutation.deleteLeftover(null, {
        id: "test-id",
      });

      expect(result).toBe(true);
      expect(Leftover.destroy).toHaveBeenCalledWith({
        where: { id: "test-id" }
      });
    });

    it("should mark a leftover as consumed", async () => {
      const mockLeftover: MockedLeftover = {
        id: "test-id",
        consumed: false,
        update: jest.fn().mockImplementation(function(this: any, data: any) {
          this.consumed = data.consumed;
          this.consumedDate = data.consumedDate;
          return Promise.resolve(this);
        }),
      };

      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockLeftover)
      );

      const result = await leftoverResolvers.Mutation.consumeLeftover(null, { id: "test-id" });

      expect(mockLeftover.update).toHaveBeenCalledWith({
        consumed: true,
        consumedDate: expect.any(Date)
      });
      expect(result).toBe(mockLeftover);
      expect(result.consumed).toBe(true);
    });

    it("should consume a portion of leftover", async () => {
      const mockLeftover: MockedLeftover = {
        id: "test-id",
        portion: 2,
        consumed: false,
        update: jest.fn().mockImplementation(function(this: any, data: any) {
          this.portion = data.portion;
          this.consumed = data.consumed;
          this.consumedDate = data.consumedDate;
          return Promise.resolve(this);
        }),
      };

      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockLeftover)
      );

      const result = await leftoverResolvers.Mutation.consumePortion(null, {
        id: "test-id",
        amount: 1
      });

      expect(mockLeftover.update).toHaveBeenCalledWith({
        portion: 1,
        consumed: false,
        consumedDate: undefined
      });
      expect(result.portion).toBe(1);
      expect(result.consumed).toBe(false);
    });

    it("should fully consume a leftover when portion reaches zero", async () => {
      const mockLeftover: MockedLeftover = {
        id: "test-id",
        portion: 1,
        consumed: false,
        update: jest.fn().mockImplementation(function(this: any, data: any) {
          this.portion = data.portion;
          this.consumed = data.consumed;
          this.consumedDate = data.consumedDate;
          return Promise.resolve(this);
        }),
      };

      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockLeftover)
      );

      const result = await leftoverResolvers.Mutation.consumePortion(null, {
        id: "test-id",
        amount: 1
      });

      expect(mockLeftover.update).toHaveBeenCalledWith({
        portion: 0,
        consumed: true,
        consumedDate: expect.any(Date)
      });
      expect(result.portion).toBe(0);
      expect(result.consumed).toBe(true);
    });

    it("should validate consumption amount is positive", async () => {
      const mockLeftover: MockedLeftover = {
        id: "test-id",
        portion: 1,
      };

      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockLeftover)
      );

      await expect(
        leftoverResolvers.Mutation.consumePortion(null, { id: "test-id", amount: 0 })
      ).rejects.toThrow("Consumption amount must be greater than zero");
    });

    it("should handle leftover not found in mutations", async () => {
      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(null)
      );

      await expect(
        leftoverResolvers.Mutation.consumeLeftover(null, { id: "non-existent" })
      ).rejects.toThrow("Leftover with ID non-existent not found");

      await expect(
        leftoverResolvers.Mutation.updateLeftover(null, {
          id: "non-existent",
          leftoverInput: { name: "Updated" }
        })
      ).rejects.toThrow("Leftover with ID non-existent not found");

      await expect(
        leftoverResolvers.Mutation.consumePortion(null, { id: "non-existent", amount: 1 })
      ).rejects.toThrow("Leftover with ID non-existent not found");
    });
  });
});
