const Joi            = require('joi');

const availability = availabilityObject => {
    const objectSchema = Joi.object().keys({
    	_resourceId: Joi.number().integer().min(0),
	_type: Joi.number().integer().min(0),
    	_minDeposit: Joi.number().integer().min(0),
    	_commission: Joi.number().integer().min(0),
    	_freeCancelDateTs: Joi.number().integer().min(0),
    	_startDateTs: Joi.number().integer().min(0),
    	_endDateTs: Joi.number().integer().min(0),
	_quantity: Joi.number().integer().min(0),
    	_metaDataLink: Joi.string()
    });
    const joiValidation = Joi.validate(availabilityObject, objectSchema);

    // if (!web3.utils.isAddress(availabilityObject._ownerAddress))
    // 	joiValidation.error = {...joiValidation.error, addressError: "Invalid owner address (_ownerAddress)"};

    return joiValidation;
};

module.exports = {
    availability
};
