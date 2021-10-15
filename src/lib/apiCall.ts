const ROOT_URL = 'https://rickandmortyapi.com/api';
type QueryType = 'single' | 'array' | 'filtring-object';
type EndPoint = 'location' | 'character' | 'episode';
type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';
interface Origin {
    name: string,
    url: string
}
interface GenPropObj extends Origin {
    id: number,
    created: string
}

interface CharactersData extends GenPropObj {
    status: CharacterStatus,
    species: string,
    type: string,
    gender: CharacterGender,
    origin: Origin,
    location: Origin,
    image: string,
    episode: string[]
}
interface GenFilterObj {
    name?: string,
    type?: string,
    page?: string,
}
interface CharactersFilter extends GenFilterObj {
    status?: CharacterStatus,
    gender?: CharacterGender,
    species?: string
}
interface LocationData extends GenPropObj {
    type: string,
    demension: string,
    residents: string[]
}
interface LocationFilters extends GenFilterObj {
    demension?: string
}
export interface EpisodeData {
    air_date: string,
    episode: string,
    characters: string[]
}
interface EpisodeFilters extends Pick<GenFilterObj, 'name'> {
    episode?: string
}
export interface InfoWrap<T> {
    info?: {
        count: number,
        pages: number,
        next: string,
        prev: string
    },
    results: T
}
type FilterParams = CharactersFilter | EpisodeFilters | LocationFilters;
type QueryParams = FilterParams | number | number[];
function createQueryString(query: QueryParams, type: QueryType) {
    switch (type) {
        case 'filtring-object':
            return `${new URLSearchParams(query as Record<string, string>)}`;
        default:
            return `${query}`
    }
}
function getQueryType(query: QueryParams): QueryType | 'undefined' {
    if (typeof query === 'number') {
        return 'single';
    } else if (Array.isArray(query) && query.every(num => typeof num === 'number')) {
        return 'array'
    } else if (!Array.isArray(query)) {
        return `filtring-object`
    } else {
        return `undefined`;
    }
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
export async function getData(endPoint: 'character', query: FilterParams): Promise<InfoWrap<CharactersData>>;
export async function getData(endPoint: 'location', query: FilterParams): Promise<InfoWrap<LocationData>>;
export async function getData(endPoint: 'episode', query: FilterParams): Promise<InfoWrap<EpisodeData>>;
export async function getData(endPoint: 'character', query: number): Promise<CharactersData>;
export async function getData(endPoint: 'location', query: number): Promise<LocationData>;
export async function getData(endPoint: 'episode', query: number): Promise<EpisodeData>;
export async function getData(endPoint: 'character', query: number[]): Promise<CharactersData[]>;
export async function getData(endPoint: 'location', query: number[]): Promise<LocationData[]>;
export async function getData(endPoint: 'episode', query: number[]): Promise<EpisodeData[]>;
export async function getData(endPoint: EndPoint, query: QueryParams) {
    const queryType = getQueryType(query);
    if (queryType === 'undefined')
        throw new Error('`getData failed.\tInvalid QueryParams')
    const queryString = createQueryString(query, queryType);
    const response = await fetch(`${ROOT_URL}/${endPoint}/${queryString}`);
    if (response.ok) {
        const data = response.json();
        switch (endPoint) {
            case 'character':
                return getResponseType<CharactersData>(queryType, data);
            case 'episode':
                return getResponseType<EpisodeData>(queryType, data);
            case 'location':
                return getResponseType<LocationData>(queryType, data);
        }
    } else {
        throw new Error(`getData failed.\t${response.statusText}`);
    }
}