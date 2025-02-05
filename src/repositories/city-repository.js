const CrudRepository = require("./crud-repository");
const { City } = require("../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
class CityRepository extends CrudRepository{
    constructor(parameters) {
        super(City);
        this.model = City;
    }

    async getAll() {
        const response = await this.model.findAll({
            attributes: ['id', 'name'], 
        });
        return response;
    }

    async get(data) {
        const response = await this.model.findByPk(data, {
            attributes: ['id', 'name'], 
        });
        if(!response){
            throw new AppError("The id you requested is not present", StatusCodes.NOT_FOUND)
          }
        return response;
    }
    
}

module.exports = CityRepository;