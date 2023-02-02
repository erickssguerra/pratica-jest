import supertest from "supertest";
import app from "../src/index";
import fruits from "data/fruits";

const server = supertest(app);

beforeEach(() => {
  const id = fruits.length + 1;
  fruits.push({
    name: "apple",
    price: 200,
    id,
  });
});

afterEach(() => {
  fruits.splice(0, fruits.length);
});

describe(" POST /fruits route  ", () => {
  it("should respond with status 409 when body.name is duplicated (unique value)", async () => {
    const body = {
      name: "apple",
      price: 200,
    };
    const result = await server.post("/fruits").send(body);
    const status = result.status;
    expect(status).toBe(409);
  });
  it("should respond with status 422 when body requisition has missing info", async () => {
    const body = {
      name: "Banana",
    };
    const result = await server.post("/fruits").send(body);
    const status = result.status;

    expect(status).toBe(422);
  });

  it("should respond with status 422 when body requisition has missing info", async () => {
    const body = {
      price: 123,
    };

    const result = await server.post("/fruits").send(body);
    const status = result.status;
    expect(status).toBe(422);
  });

  it("should respond with status 422 when body requisition is empty", async () => {
    const body = {};

    const result = await server.post("/fruits").send(body);
    const status = result.status;
    expect(status).toBe(422);
  });

  it("should respond with status 201 when body requisition is valid and unique", async () => {
    const body = {
      name: "Banana",
      price: 200,
    };
    const result = await server.post("/fruits").send(body);
    const status = result.status;
    expect(status).toBe(201);
  });
});

describe("GET /fruits route tests ", () => {
  it("should respond with status 200 when getting objects from database", async () => {
    const result = await server.get("/fruits");
    const status = result.status;

    if (!result.body.length) {
      expect(result.body).toEqual(expect.arrayContaining([]));
    }

    if (result.body.length) {
      expect(result.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            price: expect.any(Number),
            id: expect.any(Number),
          }),
        ])
      );
    }

    expect(status).toBe(200);
  });
});

describe("GET /fruits/:id route tests", () => {
  it("should respond with status 404 when there's no corresponding fruit in database", async () => {
    const result = await server.get("/fruits/-1");
    expect(result.status).toBe(404);
  });

  it("should respond with status 200 when the fruit exists in the database", async () => {
    const result = await server.get("/fruits/1");
    expect(result.status).toBe(200);
    expect(result.body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        price: expect.any(Number),
        id: expect.any(Number),
      })
    );
  });
});
