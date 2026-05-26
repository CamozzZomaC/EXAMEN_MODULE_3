//Librerías
import { Request, Response, NextFunction } from "express";
import { describe, test, expect, beforeEach, vi } from "vitest";

// Código a probar
import { ProductsController } from "./products.controller"

//Mocks
//Creamos un mock para simular un repositorio de productos. Cada método del mock es una función simulada que podemos configurar para devolver valores específicos o lanzar errores según sea necesario para nuestras pruebas. Esto nos permite probar el comportamiento del controlador sin depender de una implementación real del repositorio. Además, mockeamos Express para simular las solicitudes y respuestas, lo que nos permite verificar cómo el controlador maneja diferentes escenarios sin necesidad de un servidor real. También mockeamos la función next para asegurarnos de que los errores se manejen correctamente.
describe("Given the ProductsController class", () => {
    const fakeRepo  = {
        read: vi.fn(), //vi.fn crea una función simulada que podemos usar para rastrear llamadas y definir comportamientos personalizados.
        readById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    }
    const controller = new ProductsController(fakeRepo); //Creamos una instancia del controlador utilizando el mock del repositorio.
    const mockRes = () => {
        const res: Partial<Response> = { //Partial es un tipo de utilidad de TypeScript que hace que todas las propiedades de un tipo sean opcionales, lo que nos permite definir solo las partes del objeto Response que necesitamos para nuestras pruebas.
            json: vi.fn(), //Creamos un mock para la respuesta de Express, simulando el método json.
            status: vi.fn().mockReturnThis(), //Simulamos el método status y hacemos que devuelva el mismo objeto res para permitir encadenar llamadas.
        };
        return res as Response;
    };
    const next: NextFunction = vi.fn(); //Creamos un mock para la función next de Express, que se utiliza para manejar errores. 

    beforeEach(async () => {
        vi.clearAllMocks(); //Antes de cada prueba, limpiamos todos los mocks para asegurarnos de que no haya interferencias entre pruebas.
    });

    //Aquí vamos a testear el método getAll del controlador, que se encarga de obtener todos los productos. Vamos a probar dos casos: uno en el que el repositorio devuelve una lista válida de productos y otro en el que el repositorio lanza un error.
    describe('When executing getAll method', () => {
        //HAPY PATH
        describe('And the repository returns a valid list of products', () => {
            test('Then it should respond with all products inside results', async () => { //Es async porque todos los métodos CRUD del repo original esperan ser llamados mediante promesas, que en testing se hacen mediante mockResolvedValueOnce o mockRejectedValueOnce, que son funciones de vi para simular el comportamiento de las promesas en los mocks.
                //ARRANGE son los pasos necesarios para preparar el entorno de la prueba, como crear objetos, configurar mocks, etc.
                const req = {} as Request;
                const res = mockRes();
                const fakeProducts = [
                    { id: '1', name: 'Product 1'}
                ];
                fakeRepo.read.mockResolvedValueOnce(fakeProducts) //Aquí estamos configurando el mock del método falso read del repositorio para que devuelva una lista de productos falsa cuando se llame durante la prueba.

                //ACT es la parte donde se ejecuta el código que queremos probar, en este caso, el método getAll del controlador.
                await controller.getAll(req, res, next);

                //ASSERTION es la parte donde se verifican los resultados de la prueba, asegurándose de que el comportamiento del código sea el esperado.
                expect(fakeRepo.read).toHaveBeenCalled(); //Aquí estamos verificando que el método read del repositorio haya sido llamado durante la ejecución del método getAll.
                expect(res.json).toHaveBeenCalledWith({ //Aquí estamos verificando que el método json de la respuesta haya sido llamado con un objeto que contiene los productos falsos dentro de la propiedad results y una cadena vacía en la propiedad error.
                    results: fakeProducts,
                    error: '', //error es una cadena vacía porque en el caso de éxito no hay errores que reportar.
                });
                expect(next).not.toHaveBeenCalled(); //Aquí estamos verificando que la función next no haya sido llamada, lo que indica que no se produjo ningún error durante la ejecución.
                })
            })
        //ERROR PATH
        describe('And the repository thorws an error', () => {
            test('Then it should call next with the received error', async () => {
                //ARRANGE
                const req = {} as Request; //Aquí estamos simulando una solicitud vacía, ya que el método getAll no requiere ningún dato específico.
                const res = mockRes();
                const fakeError = new Error('Real is failing'); //Creamos un error falso para simular el caso de error.
                fakeRepo.read.mockRejectedValueOnce(fakeError) //Aquí estamos configurando el mock del método read del repositorio para que lance un error falso cuando se llame durante la prueba.

                //ACT
                await controller.getAll(req, res, next);

                //ASSERTION
                expect(next).toHaveBeenCalledWith(fakeError)
                }) //Aquí estamos verificando que la función next haya sido llamada con el error falso, lo que indica que el controlador manejó correctamente el error lanzado por el repositorio.
            })
        })
    describe ('When getById', () => {
        describe('And the repository finds a product with the received id', () => {
            test('Then it should respond with the found product inside results', async () => {
                //ARRANGE
                const req = {
                    params: { id: '1'},
                } as unknown as Request; //Simulamos una búsqueda por id. as unknown as Request es una forma de decirle a TypeScript que trate el objeto como un tipo Request.
                const res = mockRes();
                const fakeProduct = { id: '1', name: 'Product 1' };

                fakeRepo.readById.mockResolvedValueOnce(fakeProduct);
                //ACT
                await controller.getById(req, res, next);
                //ASSERTION
                expect(fakeRepo.readById).toHaveBeenCalledWith(1);
                expect(res.json).toHaveBeenCalledWith({
                    results: fakeProduct,
                    error: '',
                });
                expect(next).not.toHaveBeenCalled();
            })
        })
        describe('And repo throws an error while searching the product', () => {
            test('Then it should call next', async () => {
                //ARRANGE
                const req = {
                    params: { id: '50'},
                } as unknown as Request; //Aquí estamos simulando una solicitud con un id que no existe en el repositorio, lo que debería provocar un error. as unknown as Request es una forma de decirle a TypeScript que trate el objeto como un tipo Request.
                const res = mockRes();
                const fakeError = new Error('Real is failing');
                //ACT
                await controller.getById(req, res, next);
                //ASSERTION
                expect(next).toHaveBeenCalledWith(fakeError)
            })
        })
    })
    describe('When executing create', () => {
        describe('And the repo creates products successfully', () => {
            test('Then it should create a fake product', async () => {
                //ARRANGE
                const req = { //Aquí estamos simulando una solicitud para crear un nuevo producto, con un cuerpo que contiene el nombre del producto a crear.
                    body: {
                        name: 'Fake product 2'
                    }
                } as unknown as Request;
                const res = mockRes();
                const createdProduct = { //Aquí estamos definiendo un producto falso que representa el resultado esperado de la creación del producto. Este objeto se utilizará para configurar el mock del método create del repositorio.
                    id: '2',
                    name: 'Fake product 2',
                };
                fakeRepo.create.mockResolvedValueOnce(createdProduct);
                //ACT
                await controller.create(req, res, next);
                //ASSERT
                expect(fakeRepo.create).toHaveBeenCalledWith(req.body);

                expect(res.json).toHaveBeenCalledWith({
                    results: [createdProduct],
                    error: '',
                });
                expect(next).not.toHaveBeenCalled();
            })
        })
        describe('And the repository throws an error while creating the product', () => {
            test('Then it should call next', async () => {
                //ARRANGE
                const req = {
                body: { //Igual pero para testear un producto que dió error.
                    name: 'Broken Product',
                },
                } as unknown as Request;
                const res = mockRes();
                const fakeError = new Error('Create failed');
                fakeRepo.create.mockRejectedValueOnce(fakeError);
                // ACT
                await controller.create(req, res, next);
                // ASSERT
                expect(next).toHaveBeenCalledWith(fakeError);
            })
        })
    })
    describe('When executing update', () => {
        describe('And the repo updates sucessfully a product', () => {
            test('hen it should update the fake product data', async () => {
                //ARRANGE
                const req = { //Igual que en getById y create: buscamos por id e introducimos un body con un campo.
                    params: {
                        id: '1'
                    },
                    body: {
                        name: 'Updated fake product'
                    }
                } as unknown as Request;
                const res = mockRes();
                const updatedProduct = {
                    id: '1',
                    name: 'Updated fake product'
                };
                fakeRepo.update.mockResolvedValueOnce(updatedProduct)
                //ACT
                await controller.update(req, res, next);
                //ASSERTION
                expect(fakeRepo.update).toHaveBeenCalledWith(1, req.body)
                expect(res.json).toHaveBeenCalledWith({
                    results: [updatedProduct],
                    error: '',
                })
                expect(next).not.toHaveBeenCalled();
            })    
        })
        describe('And the repository throw an error', () => {
            test('Then it should call next', async () => {
                //ARRANGE
                const req = {
                    params: {
                        id: '1'
                    },
                    body: {
                        name: 'Fail Update'
                    },
                }as unknown as Request;
                const res = mockRes();
                const fakeError = new Error('Update failed')
                fakeRepo.update.mockRejectedValueOnce(fakeError)
                //ACT
                await controller.update(req, res, next)
                //ASSERTION
                expect(next).toHaveBeenLastCalledWith(fakeError);
            })
        })
    })
    describe('When executing delete', () => {
        describe('And the repository deletes the product successfully', () => {
            test('Then it should respond with the deleted product inside results', async () => {
                // ARRANGE
                const req = {
                    params: {
                        id: '1',
                    },
                } as unknown as Request;

                const res = mockRes();

                const deletedProduct = {
                    id: '1',
                    name: 'Deleted Product',
                };
                fakeRepo.delete.mockResolvedValueOnce(deletedProduct);
                // ACT
                await controller.delete(req, res, next);
                // ASSERT
                expect(fakeRepo.delete).toHaveBeenCalledWith('1');
                expect(res.json).toHaveBeenCalledWith({
                    results: [deletedProduct],
                    error: '',
                });
                expect(next).not.toHaveBeenCalled();
            });
        });
        describe('And the repository throws an error', () => {
            test('Then it should call next', async () => {
                // ARRANGE
                const req = {
                    params: {
                        id: '1',
                    },
                } as unknown as Request;
                const res = mockRes();
                const fakeError = new Error('Delete failed');
                fakeRepo.delete.mockRejectedValueOnce(fakeError);
                // ACT
                await controller.delete(req, res, next);
                // ASSERT
                expect(next).toHaveBeenCalledWith(fakeError);
            });
        });
    });
})    