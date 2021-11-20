import { Db } from "mongodb";
import { openConnection } from "./mongo";
import { getSpotifyToken, listNerdCasts, searchEpisodeSpotify } from "./nerdcasts-api";
import { log } from "./util";

async function sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

//30 minutes 
const JOB_INTERVAL = 1000 * 60 * 30;

openConnection(async (db: Db) => {
    while (true) {
        const spotifyToken = await getSpotifyToken();
        const PER_PAGE = 10;
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
                    log(`Podcast already saved ${nerdcast.title}!`);
                    break;
                }

                log(`${nerdcast.title}`);
                if(spotifyToken) {
                    nerdcast.spotify = await searchEpisodeSpotify(nerdcast.title, spotifyToken);
                    console.log(nerdcast.spotify?.href);
                }
                nerdCastsInsert.push(nerdcast);
            }

            if (nerdCastsInsert.length > 0) {
                log(`Inserting ${nerdCastsInsert.length} new podcasts!`);
                await nerdcastsCollection.insertMany(nerdCastsInsert);
            }

            if (nerdCastsInsert.length < PER_PAGE)
                break;

            currentPage++;
        }
        log('done');

        await sleep(JOB_INTERVAL);
    }
});