import {
    LocationData,
    EpisodeData,
    CharacterData,
    typesOfDataReceived,
    Info
} from './apiTypes'
export function getSeasonsAndEpisode(episodeAndStr: string) {
    const matchArray = episodeAndStr.match(/S(\d+)E(\d+)/) as RegExpMatchArray;
    return { episode: matchArray[2], season: matchArray[1] }
}

export function getIdFromUrl(url: string) {
    return +url.split('/').slice(-1)[0];
}
export function getPageFromUrl(url: string | null) {
    const matchResult = url ? url.split('?')[1].match(/page=(\d+)/) : null;
    return matchResult ? +matchResult[1] : null;
}
export function checkInfo(info1: Info, info2: Info): boolean {
    return (info1.next) as number === (info2.prev) as number + 1 && info1.count === info2.count && info1.pages === info2.pages;
}

export function replaceUrls(data: typesOfDataReceived<CharacterData | EpisodeData | LocationData> | Info) {
    if ('results' in data) {
        replaceUrls(data.results);
        replaceUrls(data.info);
    }
    if (Array.isArray(data))
        data.forEach((item) => replaceUrls(item));
    if ('gender' in data) {
        data.episode = data.episode.map((url) => getIdFromUrl(url as string));
        data.origin.url = getIdFromUrl(data.url as string);
        data.location.url = getIdFromUrl(data.url as string);
    }
    if ('residents' in data) {
        data.residents = data.residents.map((url) => getIdFromUrl(url as string));
    }
    if ('air_date' in data) {
        data.characters = data.characters.map((url) => getIdFromUrl(url as string));
    }
    if ('prev' in data) {
        data.prev = getPageFromUrl(data.prev as string);
        data.next = getPageFromUrl(data.next as string)
    }
}
