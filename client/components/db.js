import Dexie from 'dexie'

const database = new Dexie('wirehead').open().then(function (db) {
    console.log ("Found database: " + db.name);
    console.log ("Database version: " + db.name);
    db.tables.forEach(function (table) {
        console.log ("Found table: " + table.name);
        console.log ("Table Schema: " +
            JSON.stringify(table.schema, null, 4));
    });
}).catch('NoSuchDatabaseError', function(e) {
    // Database with that name did not exist
    console.error ("Database not found");
}).catch(function (e) {
    console.error ("oh uh: " + e);
});

// const db = new Dexie('wirehead')
// db.version(5).stores({
//   history: '++id, url, origin, start',
//   summaryHistory: 'url'
// })
export default database
