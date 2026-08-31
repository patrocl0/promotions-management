import request from "supertest";
import app from "../app";

describe("POST /api/promotions", () => {
  it("debería crear una promoción correctamente", async () => {
    const promotion = {
      name: "Promo de verano",
      targetType: "category",
      category: "Bebidas",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    };

    const response = await request(app).post("/api/promotions").send(promotion);

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      name: "Promo de verano",
      targetType: "category",
      category: "Bebidas",
      discountType: "percentage",
      discountValue: 10,
    });
  });

  it("debería rechazar un porcentaje mayor a 100", async () => {
    const promotion = {
      name: "Promo inválida",
      targetType: "category",
      category: "Bebidas",
      discountType: "percentage",
      discountValue: 150,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    };

    const response = await request(app).post("/api/promotions").send(promotion);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "El porcentaje no puede ser mayor a 100",
    });
  });

  it("debería rechazar una promoción sin nombre", async () => {
    const promotion = {
      targetType: "category",
      category: "Bebidas",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    };

    const response = await request(app).post("/api/promotions").send(promotion);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message:
        "Nombre, tipo de aplicación, tipo de descuento y valor son obligatorios",
    });
  });

  it("debería rechazar una promoción sin fechas", async () => {
    const promotion = {
      name: "Promo sin fechas",
      targetType: "category",
      category: "Bebidas",
      discountType: "percentage",
      discountValue: 10,
    };

    const response = await request(app).post("/api/promotions").send(promotion);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Las fechas de inicio y fin son obligatorias",
    });
  });

  it("debería rechazar una promoción de producto sin producto", async () => {
    const promotion = {
      name: "Promo producto",
      targetType: "product",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    };

    const response = await request(app).post("/api/promotions").send(promotion);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Debe seleccionar un producto",
    });
  });

  it("debería rechazar una promoción de categoría sin categoría", async () => {
    const promotion = {
      name: "Promo categoría",
      targetType: "category",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    };

    const response = await request(app).post("/api/promotions").send(promotion);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "Debe seleccionar una categoría",
    });
  });

  it("debería rechazar una promoción con fecha inicial posterior a la fecha final", async () => {
    const promotion = {
      name: "Promo fechas inválidas",
      targetType: "category",
      category: "Bebidas",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2026-09-30",
      endDate: "2026-09-01",
    };

    const response = await request(app).post("/api/promotions").send(promotion);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "La fecha de inicio no puede ser posterior a la fecha final",
    });
  });
});

describe("GET /api/promotions", () => {
  it("debería obtener todas las promociones", async () => {
    const promotion = {
      name: "Promo bebidas",
      targetType: "category",
      category: "Bebidas",
      discountType: "percentage",
      discountValue: 20,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    };

    await request(app).post("/api/promotions").send(promotion);

    const response = await request(app).get("/api/promotions");

    expect(response.status).toBe(200);

    expect(response.body).toHaveLength(1);

    expect(response.body[0]).toMatchObject({
      name: "Promo bebidas",
      category: "Bebidas",
      discountValue: 20,
    });
  });

  it("debería devolver un array vacío cuando no existen promociones", async () => {
    const response = await request(app).get("/api/promotions");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("GET /api/promotions/:id", () => {
  it("debería obtener una promoción por su ID", async () => {
    const createResponse = await request(app).post("/api/promotions").send({
      name: "Promo especial",
      targetType: "category",
      category: "Snacks",
      discountType: "percentage",
      discountValue: 15,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    });

    const promotionId = createResponse.body._id;

    const response = await request(app).get(`/api/promotions/${promotionId}`);

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      _id: promotionId,
      name: "Promo especial",
      category: "Snacks",
      discountValue: 15,
    });
  });

  it("debería devolver 404 si la promoción no existe", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app).get(`/api/promotions/${fakeId}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      message: "Promoción no encontrada",
    });
  });
});

describe("PUT /api/promotions/:id", () => {
  it("debería actualizar una promoción", async () => {
    const createResponse = await request(app).post("/api/promotions").send({
      name: "Promo original",
      targetType: "category",
      category: "Bebidas",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    });

    const promotionId = createResponse.body._id;

    const response = await request(app)
      .put(`/api/promotions/${promotionId}`)
      .send({
        name: "Promo actualizada",
        discountValue: 25,
      });

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      _id: promotionId,
      name: "Promo actualizada",
      discountValue: 25,
    });
  });

  it("debería devolver 404 al actualizar una promoción inexistente", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app).put(`/api/promotions/${fakeId}`).send({
      name: "Promo actualizada",
    });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      message: "Promoción no encontrada",
    });
  });
});

describe("DELETE /api/promotions/:id", () => {
  it("debería eliminar una promoción", async () => {
    const createResponse = await request(app).post("/api/promotions").send({
      name: "Promo para eliminar",
      targetType: "category",
      category: "Lácteos",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
    });

    const promotionId = createResponse.body._id;

    const response = await request(app).delete(
      `/api/promotions/${promotionId}`,
    );

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Promoción eliminada correctamente",
    });

    const getResponse = await request(app).get(
      `/api/promotions/${promotionId}`,
    );

    expect(getResponse.status).toBe(404);
  });

  it("debería devolver 404 al eliminar una promoción inexistente", async () => {
    const fakeId = "507f1f77bcf86cd799439011";

    const response = await request(app).delete(`/api/promotions/${fakeId}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      message: "Promoción no encontrada",
    });
  });
});
