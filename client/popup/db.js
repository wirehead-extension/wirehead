import Dexie from 'dexie'

var db = new Dexie('wirehead').open().then(function (db) {
  console.log ("Found database: " + db.name);
  console.log ("Database version: " + db.verno);
  db.tables.forEach(function (table) {
      console.log ("Found table: " + table.name);
      console.log ("Table Schema: " +
          JSON.stringify(table.schema, null, 4));
  });
}).catch('NoSuchDatabaseError', function(e) {
  // Database with that name did not exist
  console.error ("Database not found");
}).catch(function (e) {
  console.error ("Oh uh: " + e);
});


export default db
