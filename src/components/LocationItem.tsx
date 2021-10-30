import { FC } from 'react';
import { useUpdatingPath } from './hooks';
import '../styles/LocationItem.css';
import { LocationData } from '../lib/apiTypes'
interface LocationtItemProps {
    data: LocationData,
    list: boolean
}
const LocationItem: FC<LocationtItemProps> = props => {
    const { data, list } = props;
    const { name, dimension, type, id } = data;
    const nameWithoutDemension = name.replace(/\s*\(.*\)/, '');
    const listClass = list ? '-list' : '';
    const updatePath = useUpdatingPath();
    const itemOnClickHandle = () => {
        updatePath(`/location/${id}`)
    }
    return (
        <div className={`location-item${listClass}`} onClick={list ? itemOnClickHandle : undefined}>
            <div className={`location-item${listClass}_dimension`}>
                {dimension === 'unknown' ? 'Unknown dimension' : dimension}
            </div>
            <div className={`location-item${listClass}-main`}>
                <div className={`location-item${listClass}_type`}>{type}</div>
                <div className={`location-item${listClass}_name`}>{nameWithoutDemension}</div>
            </div>
        </div >
    );
};
export default LocationItem;