import {
    QueryParams,
    QueryType,
    InfoWrap,
    LocationData,
    EpisodeData,
    EndPoint,
    CharacterData,
    FILTERS,
    FilterParams
} from './apiTypes'
const ROOT_URL = 'https://rickandmortyapi.com/api';

function createQueryString(query: QueryParams, type: QueryType) {
    switch (type) {
        case 'filtring-object':
            return typeof query === `undefined` ? '' : `?${new URLSearchParams(query as Record<string, string>)}`;
        default:
            return `${query}`
    }
}
function getQueryType(query: QueryParams, endPoint: EndPoint): QueryType | 'invalid' {
    if (typeof query === 'number')
        return 'single';
    if (typeof query === 'undefined')
        return 'filtring-object'
    if (Array.isArray(query) && query.every(num => typeof num === 'number'))
        return 'array'
    if (!Array.isArray(query))
        if (checkFilters(query as FilterParams, endPoint))
            return `filtring-object`
    return `invalid`;
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
export async function getData(endPoint: 'character', query?: FilterParams): Promise<InfoWrap<CharacterData>>;
export async function getData(endPoint: 'location', query?: FilterParams): Promise<InfoWrap<LocationData>>;
export async function getData(endPoint: 'episode', query?: FilterParams): Promise<InfoWrap<EpisodeData>>;
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
    const queryType = getQueryType(query, endPoint);
    if (queryType === 'invalid')
        return Promise.reject(new Error('getData failed.\tInvalid QueryParams'));
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
        if (response.status === 404)
            return Promise.reject(new Error(generateErrMessage(endPoint, queryType, query)));
        return Promise.reject(new Error('getData failed.'));
    }
}
function generateErrMessage(endPont: EndPoint, type: QueryType, query: QueryParams) {
    let message = endPont[0].toUpperCase() + endPont.slice(1) + ` with this $$ was not found.`;
    switch (type) {
        case 'array':
        case 'single':
            return message.replace('$$', 'id');
        case 'filtring-object':
            return message.replace('$$', [...Object.keys(query as object)].join(','));
    }
}
function checkFilters(query: FilterParams, endPoint: EndPoint) {
    const keys = [...Object.keys(query)];
    return keys.every(key => {
        return FILTERS.get(endPoint)?.has(key) && typeof query[key] === 'string' && typeof key === 'string';;
    })

}

