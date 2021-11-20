import { Db, MongoClient } from "mongodb";
import { MONGO_CNSTRING } from "./config";
import { log } from "./util";

const dbName = 'nerdcastdb';

export const openConnection = (callback: (db: Db) => any | void) => {
    const client = new MongoClient(MONGO_CNSTRING);
    client.connect(async function (err) {
        if (err)
            throw new Error("error while establishing connection do database " + err.message);

        log('Connected successfully to server');
        const db: Db = client.db(dbName);
        await callback(db);
        log('cb called');
        client.close();
    });
}
