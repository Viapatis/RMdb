import { FC } from 'react';
import { useHistory } from "react-router-dom";
interface EpisodeListItemProps {
    id: number,
    air_date: string,
    episode: string,
    name: string
}

const EpisodeListItem: FC<EpisodeListItemProps> = props => {
    const { id, air_date, episode, name } = props;
    const episodeNumber = (episode.match(/S\d+E(\d+)/) as RegExpMatchArray)[1];
    const handleEpisodeListItemClick = () => {
        const history = useHistory();
        history.push(`/episode/${id}`);
    }
    return (
        <li className='list-item' onClick={handleEpisodeListItemClick}>
            <div className='info-group'>
                <div className='list-item-number'>{episodeNumber}</div>
                <div className='list-item-name'>{name}</div>
            </div>
            <div className='info-group sub-info'>
                <div className='list-item-airdate'>{air_date}</div>
            </div>
        </li>
    )
}
export default EpisodeListItem;