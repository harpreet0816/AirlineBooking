const { StatusCodes } = require("http-status-codes");
const { AirplaneRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data) {
    try {
        const airplane = await airplaneRepository.create(data);
        return airplane;
    } catch (error) {
        console.warn(error.message)
        if(error.name === "SequelizeValidationError"){
            let explanation = [];
            error.erros.forEach(err=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        }
        throw new AppError("Cannot create a new Airplane object", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAirplanes(data) {
    try {
        const airplanes = await airplaneRepository.getAll();
        return airplanes;
    } catch (error) {
        console.warn(error.message)
        throw new AppError("Cannot fetch data of all the airplanes", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAirplane(id) {
    try {
        const airplanes = await airplaneRepository.get(id);
        return airplanes;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError([error.message], error.statusCode)
        }
        throw new AppError("Cannot fetch data of the airplane", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAirplane(id) {
    try {
        const airplane = await airplaneRepository.get(id);
        return airplane;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError(error.message, error.statusCode)
        }
        throw new AppError("Cannot fetch data of the airplane", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function destroyAirplane(id) {
    try {
        const airplane = await airplaneRepository.destroy(id);
        return airplane;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError(error.message, error.statusCode)
        }
        throw new AppError("Cannot fetch data of the airplane", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateAirplane(id,data) {
    try {
        const airplane = await airplaneRepository.update(id, data);
        return airplane;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError(error.message, error.statusCode)
        }
        throw new AppError("Cannot fetch data of the airplane", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    createAirplane, 
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane,
}