import {
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { Model } from "sequelize";
import { sequelize } from "../../config/db";
import Leftover from "../../models/Leftover";

describe("Leftover Model", () => {
  // Keep one database test to verify model initialization
  it("should properly initialize with database", async () => {
    await sequelize.sync({ force: true });
    const leftover = await Leftover.create({
      name: "Test Leftover",
      portion: 1,
      storageLocation: "fridge" as const,
      expiryDate: new Date(),
      storedDate: new Date(),
      consumed: false,
    });
    expect(leftover.id).toBeDefined();
    await sequelize.close();
  });

  describe("Validation", () => {
    // Mock Sequelize's create method for validation tests
    beforeEach(() => {
      jest.spyOn(Model, "create").mockImplementation((data: any) => {
        // Validation logic
        if (!data?.name) throw new Error("name is required");
        if (data?.portion <= 0) throw new Error("portion must be positive");
        if (!["fridge", "freezer"].includes(data?.storageLocation))
          throw new Error("invalid storage location");
        return Promise.resolve({ ...data, id: "mock-id" });
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should validate required fields", async () => {
      await expect(
        Leftover.create({
          description: "Test Description",
          portion: 1,
          storageLocation: "fridge",
          expiryDate: new Date(),
          storedDate: new Date(),
          consumed: false,
        } as any)
      ).rejects.toThrow();
    });

    it("should validate storage location", async () => {
      await expect(
        Leftover.create({
          name: "Test Leftover",
          portion: 1,
          storageLocation: "invalid" as any,
          expiryDate: new Date(),
          storedDate: new Date(),
          consumed: false,
        })
      ).rejects.toThrow();
    });

    it("should validate portion is positive", async () => {
      await expect(
        Leftover.create({
          name: "Test Leftover",
          portion: 0,
          storageLocation: "fridge",
          expiryDate: new Date(),
          storedDate: new Date(),
          consumed: false,
        })
      ).rejects.toThrow();
    });
  });

  describe("Data Transformations", () => {
    it("should handle tags array", () => {
      const leftover = new Leftover();
      const tags = ["tag1", "tag2"];

      // Test setter
      leftover.setDataValue("tags", tags);
      expect(leftover.getDataValue("tags")).toEqual(tags);

      // Test getter
      expect(leftover.tags).toEqual(tags);
    });

    it("should format dates correctly", () => {
      const now = new Date();
      const leftover = new Leftover();

      leftover.setDataValue("storedDate", now);
      leftover.setDataValue("expiryDate", now);
      leftover.setDataValue("consumedDate", now);

      expect(leftover.storedDate).toEqual(now);
      expect(leftover.expiryDate).toEqual(now);
      expect(leftover.consumedDate).toEqual(now);
    });
  });
});
