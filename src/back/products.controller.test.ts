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
    describe('When getById is called', () => {
        //HAPPY PATH
        describe('And it shows the product searched', () => {
            test('Then it should show it', async () => {
                //ARRANGE
                const req = {
                    params: { id: '1'}
                } as unknown as Request;
                const res = mockRes();
                const fakeProduct = { id: '1', name: 'Product 1'}
                fakeRepo.readById.mockResolvedValueOnce(fakeProduct)
                //ACT
                await fcontroller.getById(req, res, next)
                //ASSERTION
                expect(fakeRepo.readById).toHaveBeenCalledWith('1')
                expect(res.json).toHaveBeenCalledWith({
                    results: [fakeProduct],
                    error: '',
                })
                expect(next).not.toHaveBeenCalled();
            })
        })
        //ERROR PATH
        describe('And the controller cannot find the product', () => {
            test('Then it should call next', async () => {
                //ARRANGE
                const req = { 
                    params: {id: '50'},
                } as unknown as Request;
                const res = mockRes();
                const fakeError = new Error;
                fakeRepo.readById.mockRejectedValueOnce(fakeError)
                //ACT
                await fcontroller.getById(req, res, next)
                //ASSERTION
                expect(res.json).not.toHaveBeenCalledWith({
                    results: '',
                    error: fakeError
                })
                expect(next).toHaveBeenCalledWith(fakeError)
            })
        })
    })
    describe('When method create is called', () => {
        //HAPY PATH
        describe('And create a product successfully', () => {
            test('Then it should create it', async () => {
                //ARRANGE
                const req = {
                    body: {
                        id: '2',
                        name: 'Fake Product 2',
                    }
                } as unknown as Request;
                const res = mockRes();
                const createdProduct = {
                    id: '2',
                    name: 'Fake Product 2',
                }
                fakeRepo.create.mockResolvedValueOnce(createdProduct)
                //ACT
                await fcontroller.create(req, res, next)
                //ASSERTION
                expect(fakeRepo.create).toHaveBeenCalledWith(req.body)
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith({
                    results: [createdProduct],
                    error: '',
                })
                expect(next).not.toHaveBeenCalled();
            })
        })
        //ERROR PATH
        describe('And it cannot create a product', () => {
            test('Then it should call next', async () => {
                //ARRANGE
                const req = { 
                    body: {},
                } as unknown as Request;
                const res = mockRes();
                const fakeError = new Error;
                fakeRepo.create.mockRejectedValueOnce(fakeError)
                //ACT
                await fcontroller.create(req, res, next)
                //ASSERTION
                expect(res.json).not.toHaveBeenCalledWith({
                    results: '',
                    error: fakeError
                })
                expect(next).toHaveBeenCalledWith(fakeError)
            })
        })
    })
    describe('When update method is called', () => {
        //HAPPY PATH
        describe('And it updates successfully', () => {
            test('Then it should show a product changed', async () => {
                const req = {
                    params: {
                        id: '2'
                    },
                    body: {
                        name: 'Updated fake product 2'
                    }
                } as unknown as Request
                const res = mockRes();
                const updatedProduct = {
                    id: '2',
                    name: 'Fake Product 2',
                }
                fakeRepo.update.mockResolvedValueOnce(updatedProduct)
                //ACT
                await fcontroller.update(req, res, next)
                //ASSERTION
                expect(fakeRepo.update).toHaveBeenCalledWith('2', req.body)
                expect(res.json).toHaveBeenCalledWith({
                    results: [updatedProduct],
                    error: '',
                })
                expect(next).not.toHaveBeenCalled();
            })
        })
        //ERROR PATH
        describe('And it cannot update a product', () => {
            test('Then it should call next', async () => {
                //ARRANGE
                const req = { 
                    params: {
                        id: '2'
                    },
                    body: {
                        name: 'Fail Update'
                    },
                } as unknown as Request;
                const res = mockRes();
                const fakeError = new Error;
                fakeRepo.update.mockRejectedValueOnce(fakeError)
                //ACT
                await fcontroller.update(req, res, next)
                //ASSERTION
                expect(res.json).not.toHaveBeenCalledWith({
                    results: '',
                    error: fakeError
                })
                expect(next).toHaveBeenCalledWith(fakeError)
            })
        })
    })
    describe('When method delete is called', () => {
        //HAPPY PATH
        describe('And it deletes the product successfully', () => {
            test('Then the product should dissapear', async () => {
                // ARRANGE
                const req = {
                    params: {
                        id: '2',
                    },
                } as unknown as Request;
                const res = mockRes();
                const deletedProduct = {
                    id: '2',
                    name: 'Deleted Product',
                };
                fakeRepo.delete.mockResolvedValueOnce(deletedProduct);
                // ACT
                await fcontroller.delete(req, res, next);
                // ASSERT
                expect(fakeRepo.delete).toHaveBeenCalledWith('2');
                expect(res.json).toHaveBeenCalledWith({
                    results: [deletedProduct],
                    error: '',
                });
                expect(next).not.toHaveBeenCalled();
            });
        });
        //ERROR PATH
        describe('And the repository throws an error', () => {
            test('Then it should call next', async () => {
                // ARRANGE
                const req = {
                    params: {
                        id: '2',
                    },
                } as unknown as Request;
                const res = mockRes();
                const fakeError = new Error();
                fakeRepo.delete.mockRejectedValueOnce(fakeError);
                // ACT
                await fcontroller.delete(req, res, next);
                // ASSERT
                expect(next).toHaveBeenCalledWith(fakeError);
            });
        });
    });
})