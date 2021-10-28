import { FC } from 'react';
import { Link } from 'react-router-dom';
import { CharacterData, Location } from '../lib/apiTypes';
import { useUpdatingPath } from './hooks';
import '../styles/CharactersItem.css';
interface CharacterstItemProps {
    data: CharacterData
    list: boolean
}
interface InfoData extends Pick<CharacterData, 'gender' | 'status' | 'type' | 'species'> {
    [index: string]: string;
}
interface LocationInfo extends Pick<CharacterData, 'origin' | 'location'> {
    [index: string]: Location;
}
const CharactersItem: FC<CharacterstItemProps> = props => {
    const { data, list } = props;
    const { name, image, gender, status, type, species, origin, location, id } = data;
    const listClass = list ? '-list' : '';
    const updatePath = useUpdatingPath();
    const charsInfo = getInfo({ gender, status, type, species });
    const locsInfo = getInfo({ origin, location })
    const itemOnClickHandle = () => {
        updatePath(`/character/${id}`)
    }
    return (
        <div className={`character-item${listClass}`} onClick={itemOnClickHandle}>
            <div className={`character-item${listClass}-main`}>
                <img className={`character-item${listClass}-image`} src={image} alt='character'></img>
                <h4 className={`character-item${listClass}-name`}>{name}</h4>
            </div>
            <div className={`character-item${listClass}-info`}>
                {
                    charsInfo.map(charInfo => {
                        const { infoName, infoValue } = charInfo;
                        return (
                            <div key={`CH${id + infoName}`} className={`character-item${listClass}-info_item`}>
                                <span className='info_item-name'>{infoName}</span>
                                <span className='info_item-value'>{infoValue}</span>
                            </div>
                        )
                    })
                }
            </div>
{
    list ? <div className='character-item-list-locations'>
        {
            locsInfo.map(locInfo => {
                const { infoName, infoValue, url } = locInfo;
                return (
                    <div key={`CH${id + infoName}`} className={`character-item-list-location`}>
                        <span className='info_location-name'>{infoName}</span>
                        <Link to={`/location/${url}`} className='info_location-value'>{infoValue}</Link>
                    </div>
                )
            })
        }
    </div> : ''
}
        </div >
    );
};
function getInfo(data: InfoData | LocationInfo) {
    return Object
        .keys(data)
        .sort()
        .map(key => {
            if ('gender' in data)
                return {
                    infoName: key[0].toUpperCase() + key.slice(1),
                    infoValue: data[key] as string
                }
            else {
                return {
                    infoName: key[0].toUpperCase() + key.slice(1),
                    infoValue: data[key].name,
                    url: data[key].url as number
                }
            }
        })
        .filter(infoItem => infoItem.infoValue !== '' && infoItem.infoValue !== 'unknown');

}
export default CharactersItem;