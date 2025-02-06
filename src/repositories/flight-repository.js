const CrudRepository = require("./crud-repository");
const { Flight } = require("../models")

class FlightRepository extends CrudRepository{
    constructor(parameters) {
        super(Flight);
    }

    async getAllFlights (filter){
        const response = Flight.findAll({
            where: filter
        });

        return response;
    }
}

module.exports = FlightRepository;