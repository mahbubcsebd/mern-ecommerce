const jwt = require('jsonwebtoken');

const createJsonWebToken = (payload, secretKey, expiresIn) => {
    if (
        typeof payload !== 'object' ||
        payload === ''
    ) {
        throw new Error('Payload must be an non-empty object');
    }

    if (typeof secretKey !== 'string' || secretKey === '') {
        throw new Error('Secret Key must be an non-empty object');
    }

    try {
        const token = jwt.sign({ payload }, secretKey, {
            expiresIn: expiresIn,
        });

        return token;
    } catch (error) {
        console.error("Couldn't create JWT token")
        throw new Error(error.message);
    }
};

module.exports = { createJsonWebToken };
