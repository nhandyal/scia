use test
db.dropDatabase();
db.copyDatabase("scia", "test", "uscscia.com:27017");

use scia;
db.dropDatabase();
db.cloneDatabase("uscscia.com:27017");
exit;