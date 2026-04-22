import { jest } from "@jest/globals";

// ✅ Use SAME mock functions
const mockCreate = jest.fn();
const mockFindOne = jest.fn();

// ✅ Mock BEFORE import
jest.unstable_mockModule("../models/MedicineUnit.js", () => ({
  default: {
    create: mockCreate,
    findOne: mockFindOne,
  },
}));

// ✅ Import AFTER mocking
const {
  createUnit,
  transferOwnership,
  verifyUnit,
} = await import("../services/medicineUnitService.js");

describe("MedicineUnit Service Tests", () => {
  const mockUnit = {
    uuid: "test-uuid",
    currentOwner: "user1",
    expirationDate: new Date("2099-12-31"),
    status: "CREATED",
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ CREATE
  test("createUnit should create a unit", async () => {
    mockCreate.mockResolvedValue(mockUnit);

    const result = await createUnit({
      drugTypeId: "drug1",
      manufacturerId: "user1",
      expirationDate: new Date(),
    });

    expect(result).toBeDefined();
    expect(mockCreate).toHaveBeenCalled();
  });

  // ❌ NOT OWNER
  test("transferOwnership should fail if not owner", async () => {
    mockFindOne.mockResolvedValue(mockUnit);

    await expect(
      transferOwnership({
        uuid: "test-uuid",
        fromUserId: "wrongUser",
        toUserId: "user2",
      })
    ).rejects.toThrow("Unauthorized transfer");
  });

  // ❌ EXPIRED
  test("transferOwnership should fail if expired", async () => {
    mockFindOne.mockResolvedValue({
      ...mockUnit,
      expirationDate: new Date("2000-01-01"),
    });

    await expect(
      transferOwnership({
        uuid: "test-uuid",
        fromUserId: "user1",
        toUserId: "user2",
      })
    ).rejects.toThrow("Cannot transfer expired medicine");
  });

  // ✅ SUCCESS
  test("transferOwnership should update owner", async () => {
    mockFindOne.mockResolvedValue(mockUnit);

    const result = await transferOwnership({
      uuid: "test-uuid",
      fromUserId: "user1",
      toUserId: "user2",
    });

    expect(result.currentOwner).toBe("user2");
    expect(mockUnit.save).toHaveBeenCalled();
  });

  // ❌ VERIFY FAIL
  test("verifyUnit should fail if not found", async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(verifyUnit("bad-uuid")).rejects.toThrow("Unit not found");
  });

  // ✅ VERIFY SUCCESS
  test("verifyUnit should return data", async () => {
    mockFindOne.mockReturnValue({
  populate: () => ({
    populate: () => ({
      populate: () => ({
        ...mockUnit,
        populate: jest.fn().mockResolvedValue(),
        drugTypeId: { name: "Drug A" },
        manufacturerId: { name: "PharmaCorp" },
        currentOwner: { name: "City Pharmacy" },
      }),
    }),
  }),
});

    const result = await verifyUnit("test-uuid");

    expect(result).toHaveProperty("uuid");
    expect(result).toHaveProperty("status");
  });
});