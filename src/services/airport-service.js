const { StatusCodes } = require("http-status-codes");
const { AirportRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

const airportRepository = new AirportRepository();

async function createAirport(data) {
    try {
        const airport = await airportRepository.create(data);
        return airport;
    } catch (error) {
        console.warn(error.message)
        if(error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError"){
            let explanation = [];
            error.errors.forEach(err=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        }
        throw new AppError("Cannot create a new Airport object", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAirports(data) {
    try {
        const airports = await airportRepository.getAll();
        return airports;
    } catch (error) {
        console.warn(error.message)
        throw new AppError("Cannot fetch data of all the airports", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getAirport(id) {
    try {
        const airports = await airportRepository.get(id);
        return airports;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError([error.message], error.statusCode)
        }
        throw new AppError("Cannot fetch data of the airport", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function destroyAirport(id) {
    try {
        const airport = await airportRepository.destroy(id);
        return airport;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError(error.message, error.statusCode)
        }
        throw new AppError("Cannot fetch data of the airport", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateAirport(id,data) {
    try {
        const airport = await airportRepository.update(id, data);
        return airport;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND  || error.name === "SequelizeUniqueConstraintError"){
            throw new AppError(error.message, error.statusCode)
        }
        throw new AppError("Cannot fetch data of the airport", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    createAirport, 
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport,
}