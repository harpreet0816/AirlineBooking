const { where } = require("sequelize");
const { Logger } = require("../config");

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }

  async destroy(data) {
    try {
      const response = await this.model.destroy({
        where: {
          id: data,
        },
      });
      return response;
    } catch (error) {
      Logger.error(
        `Something went wrong in the Crud Repo DESTROY : ${error.message}`
      );
      throw error;
    }
  }

  async get(data) {
    try {
      const response = await this.model.findByPK(data);
      return response;
    } catch (error) {
      Logger.error(
        `Something went wrong in the Crud Repo GET : ${error.message}`
      );
      throw error;
    }
  }

  async getAll() {
    try {
      const response = await this.model.findAll();
      return response;
    } catch (error) {
      Logger.error(
        `Something went wrong in the Crud Repo GETALL : ${error.message}`
      );
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await this.model.update(data, {
        where: {
          id: id,
        },
      });
      return response;
    } catch (error) {
      Logger.error(
        `Something went wrong in the Crud Repo UPDATE : ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = CrudRepository;
