const { StatusCodes } = require("http-status-codes");
const { CityRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

const cityRepository = new CityRepository();

async function createCity(data) {
    try {
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
        console.warn(error.message)
        if(error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError"){
            let explanation = [];
            error.errors.forEach(err=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST)
        }
        throw new AppError("Cannot create a new City object", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getCities(data) {
    try {
        const cities = await cityRepository.getAll();
        return cities;
    } catch (error) {
        console.warn(error.message)
        throw new AppError("Cannot fetch data of all the cities", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function getCity(id) {
    try {
        const cities = await cityRepository.get(id);
        return cities;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError([error.message], error.statusCode)
        }
        throw new AppError("Cannot fetch data of the city", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function destroyCity(id) {
    try {
        const city = await cityRepository.destroy(id);
        return city;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND){
            throw new AppError(error.message, error.statusCode)
        }
        throw new AppError("Cannot fetch data of the city", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

async function updateCity(id,data) {
    try {
        const city = await cityRepository.update(id, data);
        return city;
    } catch (error) {
        console.warn(error.message);
        if(error.statusCode === StatusCodes.NOT_FOUND  || error.name === "SequelizeUniqueConstraintError"){
            throw new AppError(error.message, error.statusCode)
        }
        throw new AppError("Cannot fetch data of the city", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    createCity, 
    getCities,
    getCity,
    destroyCity,
    updateCity,
}