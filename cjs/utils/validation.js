'use strict';

var Joi = require('joi');

var availability = function availability(availabilityObject) {
   var objectSchema = Joi.object().keys({
      _resourceId: Joi.number().integer().min(0),
      _type: Joi.number().integer().min(0),
      _minDeposit: Joi.number().integer().min(0),
      _commission: Joi.number().integer().min(0),
      _freeCancelDateTs: Joi.number().integer().min(0),
      _startDateTs: Joi.number().integer().min(0),
      _endDateTs: Joi.number().integer().min(0),
      _quantity: Joi.number().integer().min(0),
      _metaDataLink: Joi.string(),
      _signature: Joi.string(),
      _messageHash: Joi.string()
   });
   var joiValidation = Joi.validate(availabilityObject, objectSchema);

   // if (!web3.utils.isAddress(availabilityObject._ownerAddress))
   // 	joiValidation.error = {...joiValidation.error, addressError: "Invalid owner address (_ownerAddress)"};

   return joiValidation;
};

module.exports = {
   availability: availability
};