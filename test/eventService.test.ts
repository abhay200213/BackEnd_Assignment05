import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventById,
  updateEventById,
} from "../src/api/v1/services/eventService";
import * as eventRepository from "../src/api/v1/repositories/eventRepository";

jest.mock("../src/api/v1/repositories/eventRepository");

describe("eventService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an event using the repository", async () => {
    const mockedCreate = jest.mocked(eventRepository.createEventDocument);

    mockedCreate.mockImplementation(async (event) => event);

    const result = await createEvent({
      name: "Tech Conference 2025",
      date: "2099-12-25T09:00:00.000Z",
      capacity: 100,
    });

    expect(mockedCreate).toHaveBeenCalledTimes(1);
    expect(result.name).toBe("Tech Conference 2025");
  });

  it("should get all events using the repository", async () => {
    const mockedGetAll = jest.mocked(eventRepository.getAllEventDocuments);

    mockedGetAll.mockResolvedValue([
      {
        id: "evt_000001",
        name: "Event A",
        date: "2099-12-25T09:00:00.000Z",
        capacity: 100,
        registrationCount: 0,
        status: "active",
        category: "general",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    const result = await getAllEvents();

    expect(mockedGetAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
  });

  it("should get one event by id using the repository", async () => {
    const mockedGetById = jest.mocked(eventRepository.getEventDocumentById);

    mockedGetById.mockResolvedValue({
      id: "evt_000001",
      name: "Event A",
      date: "2099-12-25T09:00:00.000Z",
      capacity: 100,
      registrationCount: 0,
      status: "active",
      category: "general",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    const result = await getEventById("evt_000001");

    expect(mockedGetById).toHaveBeenCalledWith("evt_000001");
    expect(result?.id).toBe("evt_000001");
  });

  it("should update an event using the repository", async () => {
    const mockedGetById = jest.mocked(eventRepository.getEventDocumentById);
    const mockedUpdate = jest.mocked(eventRepository.updateEventDocumentById);

    mockedGetById.mockResolvedValue({
      id: "evt_000001",
      name: "Event A",
      date: "2099-12-25T09:00:00.000Z",
      capacity: 100,
      registrationCount: 0,
      status: "active",
      category: "general",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    mockedUpdate.mockResolvedValue({
      id: "evt_000001",
      name: "Event A",
      date: "2099-12-25T09:00:00.000Z",
      capacity: 100,
      registrationCount: 0,
      status: "completed",
      category: "general",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    });

    const result = await updateEventById("evt_000001", { status: "completed" });

    expect(mockedUpdate).toHaveBeenCalledTimes(1);
    expect(result?.status).toBe("completed");
  });

  it("should delete an event using the repository", async () => {
    const mockedDelete = jest.mocked(eventRepository.deleteEventDocumentById);

    mockedDelete.mockResolvedValue(true);

    const result = await deleteEventById("evt_000001");

    expect(mockedDelete).toHaveBeenCalledWith("evt_000001");
    expect(result).toBe(true);
  });
});