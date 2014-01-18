use test
db.users.ensureIndex( {email : 1}, {unique : true} );

use scia
db.users.ensureIndex( {email : 1}, {unique : true} );