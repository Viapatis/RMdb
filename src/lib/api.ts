import { getData } from "./getData";
import { QueryParams, CharactersFilter, EpisodeFilters, LocationFilters } from "./apiTypes";
export const getEpisodes = (query: QueryParams) => {
    return getData('episode', query);
}
export const getCharacters = (query: QueryParams) => {
    return getData('character', query);
}
export const getLocations = (query: QueryParams) => {
    return getData('location', query);
}
export const getEpisodesById = (query: number) => {
    return getData('episode', query);
}
export const getCharactersById = (query: number) => {
    return getData('character', query);
}
export const getLocationById = (query: number) => {
    return getData('location', query);
}
export const getEpisodesByIds = (query: number[]) => {
    return getData('episode', query);
}
export const getCharactersByIds = (query: number[]) => {
    return getData('character', query);
}
export const getLocationByIds = (query: number[]) => {
    return getData('location', query);
}
export const getEpisodesByFilter = (query?: EpisodeFilters) => {
    return getData('episode', query);
}
export const getCharactersByFilter = (query?: CharactersFilter) => {
    return getData('character', query);
}
export const getLocationByFilter = (query: LocationFilters) => {
    return getData('location', query);
}
export default {
    getEpisodes: getEpisodes,
    getCharacters: getCharacters,
    getLocations: getLocations,
    getEpisodeById: getEpisodesById,
    getCharacterById: getCharactersById,
    getLocationById: getLocationById,
    getEpisodesByIds: getEpisodesByIds,
    getCharactersByIds: getCharactersByIds,
    getLocationsByIds: getLocationByIds,
    getEpisodesByFilter: getEpisodesByFilter,
    getCharactersByFilter: getCharactersByFilter,
    getLocationsByFilter: getLocationByFilter
}