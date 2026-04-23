import { createEventSchema } from "../src/api/v1/validation/eventValidation";

describe("createEventSchema", () => {
  it("should validate a correct event payload", () => {
    const payload = {
      name: "Tech Conference 2025",
      date: "2099-12-25T09:00:00.000Z",
      capacity: 200,
      registrationCount: 50,
      status: "active",
      category: "conference",
    };

    const { error } = createEventSchema.validate(payload);

    expect(error).toBeUndefined();
  });

  it("should fail when name is missing", () => {
    const payload = {
      date: "2099-12-25T09:00:00.000Z",
      capacity: 200,
    };

    const { error } = createEventSchema.validate(payload);

    expect(error?.message).toBe('"name" is required');
  });

  it("should fail when capacity is less than 5", () => {
    const payload = {
      name: "Small Event",
      date: "2099-12-25T09:00:00.000Z",
      capacity: 4,
    };

    const { error } = createEventSchema.validate(payload);

    expect(error?.message).toBe('"capacity" must be greater than or equal to 5');
  });

  it("should apply defaults for optional fields", () => {
    const payload = {
      name: "ABC",
      date: "2099-12-25T09:00:00.000Z",
      capacity: 100,
    };

    const { error, value } = createEventSchema.validate(payload);

    expect(error).toBeUndefined();
    expect(value.registrationCount).toBe(0);
    expect(value.status).toBe("active");
    expect(value.category).toBe("general");
  });

  it("should fail when registrationCount is greater than capacity", () => {
    const payload = {
      name: "Overbooked Event",
      date: "2099-12-25T09:00:00.000Z",
      capacity: 100,
      registrationCount: 150,
    };

    const { error } = createEventSchema.validate(payload);

    expect(error?.message).toBe(
      '"registrationCount" must be less than or equal to ref:capacity'
    );
  });
});

