import { FC } from 'react';
import { useAppSelector } from '../store/hooks'
import { getSeasonsAndEpisode } from '../lib/tools';
import CharactersList from './CharactersList';
import '../styles/Episode.css'
const Episode: FC<{}> = props => {
    const episodeData = useAppSelector(state => state.main.episode);
    if (!episodeData)
        return (<div className='episode'></div>);
    const { episode, name, air_date } = episodeData;
    const seasAndEp = getSeasonsAndEpisode(episode);
    return (
        <div className='episode'>
            <div className='episode-header'>
                <h2 className='episode-header-number'>Season {+seasAndEp.season} Episode {+seasAndEp.episode}</h2>
                <div className='episode-header-content'>
                    <h1 className='episode-header-name'>{name}</h1>
                    <h4 className='episode-header-airdate'>Air date: {air_date}</h4>
                </div>
            </div>
            <div className='episode-contenent'>
                <h2 className='characters-title'>Episode Characters</h2>
                <CharactersList />
            </div>
        </div>
    );
};

export default Episode;