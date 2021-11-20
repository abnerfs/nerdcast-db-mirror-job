const MONGO_CNSTRING = process.env.MONGO_CNSTRING || '';
if (!MONGO_CNSTRING)
    throw new Error('MONGO_CNSTRING not found');

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

export {
    MONGO_CNSTRING,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET
}