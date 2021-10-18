const ROOT_URL = 'https://rickandmortyapi.com/api';
export type QueryType = 'single' | 'array' | 'filtring-object';
export type EndPoint = 'location' | 'character' | 'episode';
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';
export interface Origin {
    name: string,
    url: string
}
export interface GenPropObj extends Origin {
    [index: string]: any,
    id: number,
    created: string,
    error?: string
}

export interface CharacterData extends GenPropObj {
    status: CharacterStatus,
    species: string,
    type: string,
    gender: CharacterGender,
    origin: Origin,
    location: Origin,
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
export interface EpisodeFilters extends Pick<GenFilterObj, 'name'> {
    episode?: string
}
export interface InfoWrap<T> extends Pick<GenPropObj, 'error'> {
    info?: {
        count: number,
        pages: number,
        next: string,
        prev: string
    },
    results: T[]
}
export type FilterParams = CharactersFilter | EpisodeFilters | LocationFilters;
export type QueryParams = FilterParams | number | number[] | undefined;
function createQueryString(query: QueryParams, type: QueryType) {
    switch (type) {
        case 'filtring-object':
            return `${new URLSearchParams(query as Record<string, string>)}`;
        default:
            return `${query}`
    }
}
export function getQueryType(query: QueryParams): QueryType | 'inavlid' {
    if (typeof query === 'number')
        return 'single';
    if (typeof query === 'undefined')
        return 'filtring-object'
    if (Array.isArray(query) && query.every(num => typeof num === 'number'))
        return 'array'
    if (Object.keys(query).every(key => typeof key === 'string') && !Array.isArray(query))
        if (Object.keys(query).every(key => typeof (query as Record<string, string>)[key] === 'string'))
            return `filtring-object`
    return `inavlid`;
}
function getResponseType<Type>(type: QueryType, response: Promise<any>) {
    switch (type) {
        case 'array':
            return response as Promise<Type[]>
        case 'filtring-object':
            return response as Promise<InfoWrap<Type>>;
        case 'single':
            return response as Promise<Type>
    }
}
export async function getData(endPoint: 'character', query: FilterParams): Promise<InfoWrap<CharacterData>>;
export async function getData(endPoint: 'location', query: FilterParams): Promise<InfoWrap<LocationData>>;
export async function getData(endPoint: 'episode', query: FilterParams): Promise<InfoWrap<EpisodeData>>;
export async function getData(endPoint: 'character', query: number): Promise<CharacterData>;
export async function getData(endPoint: 'location', query: number): Promise<LocationData>;
export async function getData(endPoint: 'episode', query: number): Promise<EpisodeData>;
export async function getData(endPoint: 'character', query: number[]): Promise<CharacterData[]>;
export async function getData(endPoint: 'location', query: number[]): Promise<LocationData[]>;
export async function getData(endPoint: 'episode', query: number[]): Promise<EpisodeData[]>;
export async function getData(endPoint: 'episode', query?: QueryParams): Promise<InfoWrap<EpisodeData> | EpisodeData[] | EpisodeData>;
export async function getData(endPoint: 'character', query?: QueryParams): Promise<InfoWrap<CharacterData> | CharacterData[] | CharacterData>;
export async function getData(endPoint: 'location', query?: QueryParams): Promise<InfoWrap<LocationData> | LocationData[] | LocationData>;
export async function getData(endPoint: 'character'): Promise<InfoWrap<CharacterData>>;
export async function getData(endPoint: 'location'): Promise<InfoWrap<LocationData>>;
export async function getData(endPoint: 'episode'): Promise<InfoWrap<EpisodeData>>;
export async function getData(endPoint: EndPoint, query?: QueryParams) {
    const queryType = getQueryType(query);
    console.log()
    if (queryType === 'inavlid')
        throw new Error('getData failed.\tInvalid QueryParams')
    const queryString = createQueryString(query, queryType);
    const response = await fetch(`${ROOT_URL}/${endPoint}/${queryString}`);
    if (response.ok) {
        const data = response.json();
        switch (endPoint) {
            case 'character':
                return getResponseType<CharacterData>(queryType, data);
            case 'episode':
                return getResponseType<EpisodeData>(queryType, data);
            case 'location':
                return getResponseType<LocationData>(queryType, data);
        }
    } else {
        throw new Error(`getData failed.\t${response.statusText}`);
    }
}
export function replaceUrlsWithIds(endPoint: 'character', data: CharacterData): CharacterData;
export function replaceUrlsWithIds(endPoint: 'location', data: LocationData): LocationData;
export function replaceUrlsWithIds(endPoint: 'episode', data: EpisodeData): EpisodeData;
export function replaceUrlsWithIds(endPoint: 'character', data: CharacterData[]): CharacterData[];
export function replaceUrlsWithIds(endPoint: 'location', data: LocationData[]): LocationData[];
export function replaceUrlsWithIds(endPoint: 'episode', data: EpisodeData[]): EpisodeData[];
export function replaceUrlsWithIds(endPoint: EndPoint, data: LocationData | CharacterData | EpisodeData | EpisodeData[] | CharacterData[] | LocationData[]) {
    switch (endPoint) {
        case 'character':
            if (Array.isArray(data))
                return data.map(item => replaceUrlsWithIds(endPoint, item as CharacterData));
            return {
                ...data,
                episode: (data as CharacterData).episode.map((url) => getIdFromUrl(url as string))
            } as CharacterData;
        case 'location':
            if (Array.isArray(data))
                return data.map(item => replaceUrlsWithIds(endPoint, item as LocationData));
            return {
                ...data,

                residents: (data as LocationData).residents.map((url) => getIdFromUrl(url as string))
            } as LocationData;
        case 'episode':
            if (Array.isArray(data))
                return data.map(item => replaceUrlsWithIds(endPoint, item as EpisodeData));
            return {
                ...data,
                characters: (data as EpisodeData).characters.map((url) => getIdFromUrl(url as string))
            } as EpisodeData;

    }
}
export function getIdFromUrl(url: string) {
    return +url.split('/').slice(-1)[0];
}
export function checkInfo(info1: InfoWrap<void>['info'], info2: InfoWrap<void>['info']): boolean {
    return info1?.next === info2?.prev && info1?.count === info2?.count && info1?.pages === info2?.pages;
}