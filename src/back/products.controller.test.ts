//Librerías
import { Request, Response, NextFunction } from "express";
import { beforeEach, describe, test, expect, vi } from "vitest";

//Componente a testear
import { ProductsController } from "./products.controller";

//Mock
describe('Given the ProductsController class', () => {
    const fakeRepo = {
        read: vi.fn(),
        readById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    }
    const fcontroller = new ProductsController(fakeRepo)

    const mockRes = () => {
        const res: Partial<Response> = {
            json: vi.fn(),
            status: vi.fn().mockReturnThis()
        };
        return res as Response;
    }
    const next: NextFunction = vi.fn();

    beforeEach(async () => {
        vi.clearAllMocks();
    })

    //Test

})