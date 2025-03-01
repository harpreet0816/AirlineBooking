const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models");
const CrudRepository = require("./crud-repository");
const AppError = require("../utils/errors/app-error");
const { Op } = require("sequelize");
const { Enums } = require("../utils/commons");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const response = await this.model.create(data, {
      transaction: transaction,
    });
    return response;
  }

  async getUsingT(data, transaction) {
    const response = await this.model.findByPk(data, {
      transaction: transaction,
    });
    if (!response) {
      throw new AppError(
        "Not able to find the resourse",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async updateUsingT(id, data, transaction) {
    const response = await this.model.update(
      data,
      {
        where: {
          id: id,
        },
      },
      { transaction: transaction }
    );

    if (!response[0]) {
      throw new AppError(
        "The field you requested is not present",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async cancelOldBookings(timestamp) {
    console.log(this.model, "=--");
    // const response = await this.model.findAll({
    //   where: {
    //     createdAt: {
    //       [Op.lt]: timestamp
    //     }
    //   }
    // });
    const response = await this.model.update(
      {
        status: CANCELLED,
      },  
      {
        where: {
          [Op.and]: [
            {
              createdAt: {
                [Op.lt]: timestamp,
              },
            },
            {
              status: {
                status: { [Op.notIn]: [CANCELLED, BOOKED] },
              },
            },
          ],
        },
      }
    );
    return response;
  }
}

module.exports = BookingRepository;
