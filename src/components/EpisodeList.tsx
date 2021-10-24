import { FC } from 'react';
import EpisodeListItem from './EpisodeListItem';
import { EpisodeData } from '../lib/apiTypes';
import '../styles/EpisodeList.css'
interface EpisodeListProps {
    data: EpisodeData[],
    seasonName: string
}

const EpisodeList: FC<EpisodeListProps> = props => {
    const { data, seasonName } = props;
    return (
        <div>
            <h2 className='season-title'>Season {+seasonName}</h2>
            <div className='episode-list'>
                {data.map(({ id, air_date, episode, name }) =>
                    <EpisodeListItem id={id} air_date={air_date} episodeAndSeason={episode} name={name} key={id} />)}
            </div>
        </div>
    )
}
export default EpisodeList;