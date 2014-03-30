var mongoose = require("mongoose");

module.exports.schema_def = {
    ticket_id           : {
        type                : String,
        required            : '{PATH} is required',
        unique              : true
    },
    ticket_description  : {
        type                : String,
        required            : '{PATH} is required'
    },
    number_of_tickets   : {
        type                : Number,
        required            : '{PATH} is required',
    },
    f_name              : {
        type                : String,
        required            : '{PATH} is required'
    },
    l_name              : {
        type                : String,
        required            : '{PATH} is required'
    },
    email               : {
        type                : String,
        required            : '{PATH} is required'
    },
    event_id            : {
        type                : mongoose.Schema.Types.ObjectId,
        required            : '{PATH} is required'
    },
    user_id             : {
        type                : mongoose.Schema.Types.ObjectId,
        required            : '{PATH} is required'
    },
    transaction_total   : {
        type                : Number,
        required            : '{PATH} is required'
    },
    transaction_details : [
        {
            quantity_sold   : {
                type            : Number,
                required        : '{PATH} is required'
            },
            sale_price      : {
                type            : Number,
                required        : '{PATH} is required'
            }
        }
    ],
    redeemed            : {
        type                : Boolean,
        default             : false
    }
};

module.exports.schema_options = {
    collection: "tickets"
};

module.exports.model_name = "Tickets";