export type QueryType = 'single' | 'array' | 'filtring-object';
export type EndPoint = 'location' | 'character' | 'episode';
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';
export interface Location {
    name: string,
    url: string | number,
}

export interface GenPropObj extends Location {
    id: number,
    created: string,
    error?: string
}

export interface CharacterData extends GenPropObj {
    status: CharacterStatus,
    species: string,
    type: string,
    gender: CharacterGender,
    origin: Location,
    location: Location,
    image: string,
    episode: string[] | number[]
}
export interface GenFilterObj {
    [index: string]: string | undefined;
    name?: string,
    type?: string,
    page?: string,
}
export interface CharactersFilter extends GenFilterObj {
    status?: CharacterStatus,
    gender?: CharacterGender,
    species?: string
}
export interface LocationData extends GenPropObj {
    type: string,
    demension: string,
    residents: string[] | number[]
}
export interface LocationFilters extends GenFilterObj {
    demension?: string
}
export interface EpisodeData extends GenPropObj {
    air_date: string,
    episode: string,
    characters: string[] | number[]
}
export interface EpisodeFilters extends Omit<GenFilterObj, 'type'> {
    episode?: string
}
export const CHARACTER_FILTERS = new Set(['name', 'type', 'page', 'status', 'gender', 'species']);
export const LOCATION_FILTERS = new Set(['name', 'type', 'page', 'demension']);
export const EPISODE_FILTERS = new Set(['name', 'page', 'episode']);
export const FILTERS = new Map([['episode', EPISODE_FILTERS], ['character', CHARACTER_FILTERS], ['location', LOCATION_FILTERS]]);
export interface Info {
    count: number,
    pages: number,
    next: string | null | number,
    prev: string | null | number
}
export interface InfoWrap<T> extends Pick<GenPropObj, 'error'> {
    info: Info,
    results: T[]
}
export type FilterParams = CharactersFilter | EpisodeFilters | LocationFilters;
export type QueryParams = FilterParams | number | number[] | undefined;
export type typesOfDataReceived<T> = T | T[] | InfoWrap<T>;