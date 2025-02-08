const CrudRepository = require("./crud-repository");
const { Flight } = require("../models")

class FlightRepository extends CrudRepository{
    constructor(parameters) {
        super(Flight);
    }

    async getAllFlights (filter, sort){
        const response = Flight.findAll({
            where: filter,
            order: sort
        });

        return response;
    }
}

module.exports = FlightRepository;