import { Db, MongoClient } from "mongodb";


const url = process.env.MONGO_CNSTRING || '';
if (!url)
    throw new Error('MONGO_CNSTRING not found');

const dbName = 'nerdcastdb';

export const openConnection = (callback: (db: Db) => any | void) => {
    const client = new MongoClient(url);
    client.connect(async function (err) {
        if (err)
            throw new Error("error while establishing connection do database " + err.message);
    
        console.log('Connected successfully to server');
        const db : Db = client.db(dbName);
        await callback(db);
        client.close();
    });
}
