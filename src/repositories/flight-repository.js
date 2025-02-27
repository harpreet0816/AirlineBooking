const { Sequelize } = require("sequelize");
const CrudRepository = require("./crud-repository");
const { Flight, Airplane, Airport, City } = require("../models");
const db = require("../models");
const { addRowLockOnFlights } = require("./queries");
class FlightRepository extends CrudRepository {
  constructor(parameters) {
    super(Flight);
  }

  async getAllFlights(filter, sort) {
    const response = Flight.findAll({
      where: filter,
      order: sort,
      include: [
        {
          model: Airplane,
          required: true, //for eagar loading inner join
          as: "airplaneDetails", //same as the alias we set in the model assocations other wise give error
        },
        {
          // by default it add a join query on airport.id but we want for airport.code for this we need to mention explicitly using on property

          // as should be same as the alias we add in model assocation and migrations
          model: Airport,
          required: true, //for eagar loading inner join
          as: "departureAirport",
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.departureAirportId"),
              "=",
              Sequelize.col("departureAirport.code")
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
        {
          model: Airport,
          required: true, //for eagar loading inner join
          as: "arrivalAirport",
          on: {
            col1: Sequelize.where(
              Sequelize.col("Flight.arrivalAirportId"),
              "=",
              Sequelize.col("arrivalAirport.code")
            ),
          },
          include: {
            model: City,
            required: true,
          },
        },
      ],
    });

    return response;
  }

  async updateRemainingSeats(flightId, seats, dec = true) {
    const transaction = await db.sequelize.transaction();
    try {
      // Need to implement a row lock here so that if multiple requests come to update the same row, we restrict them from updating it. This is a pessimistic lock.
      await db.sequelize.query(addRowLockOnFlights(flightId));

      const flightToUpdate = await Flight.findByPk(flightId);
      if (dec) {
        // const flightToUpdate = await super.get(flightId);
        //common issue with .decrement() method because it only updates the database but does not refresh the instance in memory.
        await flightToUpdate.decrement(
          "totalSeats",
          { by: seats },
          { transaction: transaction }
        );
        const response = await flightToUpdate.reload();
        await transaction.commit();
        return response;
      } else {
        await flightToUpdate.increment(
          "totalSeats",
          { by: seats },
          { transaction: transaction }
        );
        const response = await flightToUpdate.reload();
        await transaction.commit();
        return response;
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = FlightRepository;
