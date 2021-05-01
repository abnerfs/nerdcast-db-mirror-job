import { Db } from "mongodb";
import { openConnection } from "./mongo";
import { listNerdCasts } from "./nerdcasts-api";


openConnection(async (db: Db) => {
    const PER_PAGE = 500;
    let currentPage = 1;

    const nerdcastsCollection = db.collection('nerdcasts');

    while (true) {
        const nerdcasts = await listNerdCasts(PER_PAGE, currentPage);
        const nerdCastsInsert = [];

        for (const nerdcast of nerdcasts) {
            const find = await nerdcastsCollection.findOne({
                id: nerdcast.id
            });
            if (find) {
                console.log(`Podcast already saved ${nerdcast.title}!`);
                break;
            }

            console.log(`${nerdcast.title}`);
            nerdCastsInsert.push(nerdcast);
        }

        if (nerdCastsInsert.length > 0) {
            console.log(`Inserting ${nerdCastsInsert.length} new podcasts!`);
            await nerdcastsCollection.insertMany(nerdCastsInsert);
        }

        if (nerdCastsInsert.length < PER_PAGE)
            break;

        currentPage++;
    }
    console.log('done');
});