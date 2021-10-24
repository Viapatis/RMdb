import { FC } from 'react';
import { useHistory } from "react-router-dom";
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
    const history = useHistory();
    const { episode } = getSeasonsAndEpisode(episodeAndSeason);
    const handleEpisodeListItemClick = () => {
        history.push(`/episode/${id}`);
    }
    return (
        <div className='list-item' >
            <div className='info-group base-info' onClick={handleEpisodeListItemClick}>
                <div className='list-item-number'>Episode {+episode}</div>
                <div className='list-item-name'>{name}</div>
            </div>
            <div className='info-group sub-info'>
                <div className='list-item-airdate'>Air date:{air_date}</div>
            </div>
        </div>
    )
}
export default EpisodeListItem;
