const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const { errorResponse } = require('../helpers/responseHandler');

const findItemById = async (Model, id, options = {}) => {
    try {
        // Get a item by id
        const item = await Model.findById(id, options);

        // If no item found
        if (!item) throw createHttpError(
            404,
            `${Model.modelName} not exist by this id: ${id}`
        );

        return item;
    } catch (error) {
        if (error instanceof mongoose.CastError) {
         throw createHttpError(400, 'Invalid Item Id');
        }

        throw error;
    }
};

module.exports = {findItemById};