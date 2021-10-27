import { FC } from 'react';
import EpisodeList from './EpisodeList';
import { useAppSelector } from '../store/hooks'
import { getSeasonsAndEpisode } from '../lib/tools';
import {EpisodeData} from '../lib/apiTypes'
import '../styles/EpisodeListGroup.css'
const EpisodeListGroup: FC<{}> = props => {
    const episodesData = useAppSelector(state => state.main.episodes);
    const sort = useAppSelector(state => state.filter.episode.sort);
    const seasons = Array.from(new Set(episodesData.map(episodeData => getSeasonsAndEpisode(episodeData.episode).season)).values());
    const seasonsData = sortEpisodes(sort, getSeasons(Array.from(seasons.values()), episodesData));
   
    return (
        <ul className='episode-list-group' >
            {seasonsData.map((seasonData, i) => <EpisodeList key={`S${seasons[i]}`} seasonName={seasons[i]} data={seasonData} />)}
        </ul>

    )
}
function getSeasons(seasons: string[], episodesData: EpisodeData[]) {
    const rightBorders = [0];
    const seasonsData: EpisodeData[][] = [];
    for (let i = 0; i < seasons.length - 1; i++) {
        for (let j = 0; j < episodesData.length; j++) {
            if (episodesData[j].episode.match(`S${seasons[i]}`) === null) {
                rightBorders.push(j);
                i++;
            }
        }
        rightBorders.push(episodesData.length);
    }
    for (let i = 1; i < rightBorders.length; i++) {
        seasonsData.push(episodesData.slice(rightBorders[i - 1], rightBorders[i]))
    }
    return episodesData.length && episodesData.length > 1 ? seasonsData : [episodesData];
}
function sortEpisodes(string: 'name' | 'relese', episodesData: EpisodeData[][]) {
    episodesData.forEach(arr => arr.sort(string === 'name' ?
        (a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA === nameB) return 0;
            return nameA > nameB ? 1 : -1
        } :
        (a, b) => (new Date(a.air_date).getTime() - new Date(b.air_date).getTime())
    ));
    return episodesData;
}
export default EpisodeListGroup;
