import { FC } from 'react';
import { useAppSelector } from '../store/hooks'
import CharactersList from './CharactersList';
import LocationItem from './LocationItem';
import '../styles/Location.css'
const Charcter: FC<{}> = props => {
    const { location } = useAppSelector(state => state.main);
    if (!location)
        return (<div className='location'></div>);
    return (
        <div className='location'>
            <LocationItem list={false} data={location} />
            <div className='location-contenent'>
                <CharactersList showLocation={false} title={'Characters in the location'} />
            </div>
        </div>
    );
};

export default Charcter;