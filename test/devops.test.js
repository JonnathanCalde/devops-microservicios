const request = require("supertest");
const app = require("../src/server");
const { generarTokenJwtUnico } = require("../src/utils/jwt");

const validBody = {
  message: "This is a test",
  to: "Juan Perez",
  from: "Rita Asturia",
  timeToLifeSec: 45,
};

describe("Endpoint /DevOps", () => {
  test("POST válido devuelve 200 y JSON exacto", async () => {
    const token = generarTokenJwtUnico({}, 60);
    const res = await request(app)
      .post("/DevOps")
      .set("X-Parse-REST-API-Key", "2f5ae96c-b558-4c7b-a590-a501ae1c3f6c")
      .set("X-JWT-KWY", token)
      .send(validBody)
      .expect(200);

    expect(res.body).toEqual({
      message: "Hello Juan Perez your message will be sent",
    });
  });

  test("POST sin API Key devuelve 401", async () => {
    const token = generarTokenJwtUnico({}, 60);
    await request(app)
      .post("/DevOps")
      // no API Key
      .set("X-JWT-KWY", token)
      .send(validBody)
      .expect(401);
  });

  test("POST sin JWT devuelve 401", async () => {
    await request(app)
      .post("/DevOps")
      .set("X-Parse-REST-API-Key", "2f5ae96c-b558-4c7b-a590-a501ae1c3f6c")
      // no JWT
      .send(validBody)
      .expect(401);
  });

  test("GET u otros métodos devuelven 405", async () => {
    await request(app).get("/DevOps").expect(405);

    await request(app).put("/DevOps").expect(405);
  });
});

// Añadir tests para /token
describe("Endpoint /token", () => {
  test("Genera JWT cuando API Key válida", async () => {
    const res = await request(app)
      .post("/token")
      .set("X-Parse-REST-API-Key", "2f5ae96c-b558-4c7b-a590-a501ae1c3f6c")
      .send({ duration: 60 })
      .expect(200);

    expect(res.body).toHaveProperty("jwt");
  });

  test("/token sin API Key devuelve 401", async () => {
    await request(app).post("/token").send({ duration: 60 }).expect(401);
  });
});
