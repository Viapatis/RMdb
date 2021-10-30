import { FC } from 'react';
import { useAppSelector } from '../store/hooks'
import ChracterItem from './ChracterItem';
import LocationItem from './LocationItem';
import '../styles/Character.css'
const Charcter: FC<{}> = props => {
    const { character, location } = useAppSelector(state => state.main);
    if (!character)
        return (<div className='character'></div>);
    return (
        <div className='character'>
            <ChracterItem showLocation={false} list={false} data={character} />
            <div className='character-contenent'>
                <h2 className='location-title'>Location</h2>
                {location ? <LocationItem list={true} data={location}></LocationItem> : ''}
            </div>
        </div>
    );
};

export default Charcter;