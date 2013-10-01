use scia

// enforce unique email on user collection
db.users.ensureIndex( {email : 1}, {unique : true} );