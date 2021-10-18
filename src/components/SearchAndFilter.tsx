import {FC} from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks'
export const SearchAndFilter: React.FC<{}> = props => {
    return (
        <div>
            <div>
                <input type='text'></input><button>Serch</button>
            </div>
            <select>
                <option value='name'></option>
                <option value='relese'></option>
            </select>
        </div>
    );
}