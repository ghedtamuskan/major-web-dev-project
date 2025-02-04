const Joi = require("joi")  //17 helps to validate our schema handle error of schema

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null)
    }).required()
})

//18.3 // validation for reviewSchema
module.exports.reviewSchema = Joi.object({
    review :Joi.object({
rating : Joi.number().required().min(1).max(5),
comment : Joi.string().required(),
}).required()
})