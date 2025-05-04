import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import Leftover, { LeftoverAttributes } from "../../models/Leftover";
import leftoverResolvers from "../../resolvers/leftoverResolvers";

jest.mock("../../models/Leftover", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
}));

type MockedLeftover = Partial<LeftoverAttributes> & {
  update?: jest.Mock;
  destroy?: jest.Mock;
};

describe("Leftover Resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Queries", () => {
    it("should fetch all leftovers", async () => {
      const mockLeftovers: MockedLeftover[] = [
        { id: "1", name: "Test 1" },
        { id: "2", name: "Test 2" },
      ];
      (Leftover.findAll as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockLeftovers)
      );

      const result = await leftoverResolvers.Query.leftovers(null, {});
      expect(result).toHaveLength(2);
      expect(Leftover.findAll).toHaveBeenCalled();
    });

    it("should fetch a single leftover by ID", async () => {
      const mockLeftover: MockedLeftover = { id: "test-id", name: "Test Item" };
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
  });

  describe("Mutations", () => {
    it("should create a new leftover", async () => {
      const leftoverInput = {
        name: "New Leftover",
        storageLocation: "fridge" as const,
        expiryDate: new Date().toISOString(),
        portion: 1,
      };
      const mockCreated: MockedLeftover = {
        id: "new-id",
        ...leftoverInput,
        expiryDate: new Date(leftoverInput.expiryDate),
      };
      (Leftover.create as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockCreated)
      );

      const result = await leftoverResolvers.Mutation.createLeftover(null, {
        leftoverInput,
      });
      expect(result).toEqual(mockCreated);
      expect(Leftover.create).toHaveBeenCalledWith(leftoverInput);
    });

    it("should update an existing leftover", async () => {
      const updateInput = { name: "Updated Name", portion: 2 };
      const mockUpdated: MockedLeftover = { id: "test-id", ...updateInput };
      const mockInstance: MockedLeftover = {
        update: jest
          .fn()
          .mockImplementation(() => Promise.resolve(mockUpdated)),
      };
      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockInstance)
      );

      const result = await leftoverResolvers.Mutation.updateLeftover(null, {
        id: "test-id",
        leftoverInput: updateInput,
      });

      expect(result).toEqual(mockUpdated);
      expect(mockInstance.update).toHaveBeenCalledWith(updateInput);
    });

    it("should delete a leftover", async () => {
      const mockInstance: MockedLeftover = {
        destroy: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
      };
      (Leftover.findByPk as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockInstance)
      );

      const result = await leftoverResolvers.Mutation.deleteLeftover(null, {
        id: "test-id",
      });
      expect(result).toBe(true);
      expect(mockInstance.destroy).toHaveBeenCalled();
    });
  });
});
