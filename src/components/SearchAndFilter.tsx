import { FC, ChangeEvent, MouseEvent, KeyboardEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSerachString, setSortString, sortValue, setBtnValue } from '../store/slices/Filter'
import { useUpdatingPath } from './hooks';
import '../styles/SearchAndFilter.css'
interface SearchAndFilterProps {
    type: 'episode'
}
const SearchAndFilter: FC<SearchAndFilterProps> = props => {
    const type = props.type;
    const { sort, btnValue, search, options } = useAppSelector(state => state.filter[type]);
    const err = useAppSelector(state => state.main.requestInfo.err);
    const displayErr = err ? '' : ' hide';
    const dispatch = useAppDispatch();
    const updatingPath = useUpdatingPath();
    const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSerachString({ name: type, value: event.target.value }));
    }
    const handleBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
        updatingPath({ name: search });
        dispatch(setBtnValue({ name: type, value: btnValue }));
    }
    const handleInputEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            updatingPath({ name: search });
        }
    }
    const handleSortOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSortString({ name: type, value: event.target.value as sortValue }));
    }

    return (
        <div className='serach-and-filter'>
            <div className='serach-block'>
                <div className='search-main'>
                    <input
                        className='serach-string input-text'
                        type='text'
                        value={search}
                        onChange={handleSearchOnChange}
                        onKeyDown={handleInputEnter}
                        placeholder='Enter episode name'></input>
                    <button onClick={handleBtnClick} value={btnValue + ''} className='serch-button button'>Serch</button>
                </div>
                <span className={'search-err' + displayErr} >{err}</span>
            </div>
            <select value={sort} onChange={handleSortOnChange} className='filter-select select'>
                {options.map(opt => <option key={opt} className='filter-option' value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}
export default SearchAndFilter;