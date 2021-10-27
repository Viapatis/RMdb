import { FC } from 'react';
import { useUpdatingPath } from './hooks';
import { getSeasonsAndEpisode } from '../lib/tools';
import '../styles/EpisodeListItem.css'
interface EpisodeListItemProps {
    id: number,
    air_date: string,
    episodeAndSeason: string,
    name: string
}

const EpisodeListItem: FC<EpisodeListItemProps> = props => {
    const { id, air_date, episodeAndSeason, name } = props;
    const updatePath = useUpdatingPath();
    const { episode } = getSeasonsAndEpisode(episodeAndSeason);
    const handleEpisodeListItemClick = () => {
        updatePath(`/episode/${id}`);
    }
    return (
        <li className='episode-item' >
            <div className='info-group base-info' onClick={handleEpisodeListItemClick}>
                <span className='episode-item-number'>Episode {+episode}</span>
                <span className='episode-item-name'>{name}</span>
            </div>
            <div className='info-group sub-info'>
                <div className='episode-item-airdate'>Air date:{air_date}</div>
            </div>
        </li>
    )
}
export default EpisodeListItem;
