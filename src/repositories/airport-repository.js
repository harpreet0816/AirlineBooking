const CrudRepository = require("./crud-repository");
const { Airport }  = require("../models");

class AirportRepository extends CrudRepository {
    constructor(){
        super(Airport);
        this.model = Airport;
    }

}

module.exports = AirportRepository;