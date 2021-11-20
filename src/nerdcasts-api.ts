import axios from 'axios';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from './config';

export interface NerdCast {
    spotify: SpotifySearchResult | undefined;
    id: number;
    url: string;
    published_at: Date;
    pub_date: Date;
    modified_at: Date;
    duration: number;
    title: string;
    slug: string;
    episode: string;
    product: string;
    product_name: string;
    friendly_post_type: string;
    friendly_post_type_slug: string;
    friendly_post_time: string;
    friendly_post_date: string;
    subject: string;
    image: string;
    image_alt: null;
    thumbnails: Thumbnails;
    audio_high: string;
    audio_medium: string;
    audio_low: string;
    audio_zip: string;
    insertions: Insertion[];
    description: string;
    "jump-to-time": JumpToTime;
    guests: Array<string>;
    post_type_class: string;
    uploaded: boolean;
}

export interface Thumbnails {
    "img-4x3-355x266": string;
    "img-16x9-1210x544": string;
    "img-16x9-760x428": string;
    "img-4x6-448x644": string;
    "img-1x1-3000x3000": string;
}

export interface Insertion {
    id: number;
    title: string;
    image: string;
    link: string;
    "button-title": string;
    "start-time": number;
    "end-time": number;
    sound: boolean;
}

export interface JumpToTime {
    test: string;
    "start-time": number;
    "end-time": number;
}


export interface SpotifySearchResultExternalUrls {
    spotify: string;
}

export interface SpotifySearchResultImage {
    height: number;
    url: string;
    width: number;
}

export interface SpotifySearchResult {
    audio_preview_url: string;
    description: string;
    duration_ms: number;
    explicit: boolean;
    external_urls: SpotifySearchResultExternalUrls;
    href: string;
    html_description: string;
    id: string;
    images: SpotifySearchResultImage[];
    is_externally_hosted: boolean;
    is_playable: boolean;
    language: string;
    languages: string[];
    name: string;
    release_date: string;
    release_date_precision: string;
    type: string;
    uri: string;
}



const shouldUseSpotify = SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET;

export const listNerdCasts = (perPage: number, page: number) =>
    axios.get(`https://jovemnerd.com.br/wp-json/jovemnerd/v1/nerdcasts/?per_page=${perPage}&page=${page}`)
        .then(res => res.data)
        .then((nerdcasts: any[]) => nerdcasts.map(x => {
            x.guests = x.guests?.split(',') || [];
            return x;
        }))
        .then((nerdcasts: NerdCast[]) => nerdcasts.map(x => {
            x.pub_date = new Date(x.pub_date);
            return x;
        }));

export const getSpotifyToken = async (): Promise<string | undefined> => {
    if (!shouldUseSpotify)
        return;

    const basicAuth = 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    return axios.post(`https://accounts.spotify.com/api/token`,
        `grant_type=client_credentials`, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": basicAuth
        }
    })
        .then(res => res.data.access_token);

}

export const searchEpisodeSpotify = async (name: string, token: string): Promise<SpotifySearchResult | undefined> => {
    if (!shouldUseSpotify)
        return

    const encodedName = encodeURIComponent(name);
    return axios.get(`https://api.spotify.com/v1/search?q=${encodedName}&market=BR&type=episode&limit=1`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
        .then(res => res.data.episodes.items[0] as SpotifySearchResult | undefined);
}