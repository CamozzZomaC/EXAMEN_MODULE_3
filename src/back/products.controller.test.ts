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
    describe('When executing getAll method', () => {
        //HAPPY PATH
        describe('And the repositoy returns a valid list of products', () => {
            test('Then it should return all prtoducts', async () => {
                //ARRANGE
                const req = {} as Request;
                const res = mockRes();
                const fakeProducts = [
                    { id: '1', name: 'Product 1'},
                    { id: '1', name: 'Product 2'},
                ];
                fakeRepo.read.mockResolvedValueOnce(fakeProducts)
                //ACT
                await fcontroller.getAll(req, res, next)
                //ASSERTION
                expect(fakeRepo.read).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalledWith({
                    results: fakeProducts,
                    error:''
                })
                expect(next).not.toHaveBeenCalled()
            })
        })
        describe('And the controller throws an error', () => {
            test('Then it should call next', async () => {
                //ARRANGE
                const req = { } as Request;
                const res = mockRes();
                const fakeError = new Error;
                fakeRepo.read.mockRejectedValueOnce(fakeError)
                //ACT
                await fcontroller.getAll(req, res, next)
                //ASSERTION
                expect(res.json).not.toHaveBeenCalledWith({
                    results: '',
                    error: fakeError
                })
                expect(next).toHaveBeenCalledWith(fakeError)

            })
        })
    })
})