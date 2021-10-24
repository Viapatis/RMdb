import { FC, ChangeEvent, MouseEvent, KeyboardEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSerachString, setSortString, sortValue, setBtnValue } from '../store/slices/Filter'
import { useHistory } from 'react-router';
import '../styles/SearchAndFilter.css'
const SearchAndFilter: FC<{}> = props => {
    const { sort, btnValue, search } = useAppSelector(state => state.filter.episode);
    const err = useAppSelector(state => state.main.requestInfo.err);
    const displayErr = err ? '' : ' hide';
    const history = useHistory();
    const dispatch = useAppDispatch();
    const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSerachString({ name: 'episode', value: event.target.value }));
    }
    const handleBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
        history.push(`/${search ? `?name=${search}` : ''}`);
        dispatch(setBtnValue({ name: 'episode', value: btnValue }))
    }
    const handleInputEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter')
            history.push(`/${search ? `?name=${search}` : ''}`);
    }
    const handleSortOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSortString({ name: 'episode', value: event.target.value as sortValue }));
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
                <option className='filter-option' value='name'>name</option>
                <option className='filter-option' value='relese'>relese</option>
            </select>
        </div>
    );
}
export default SearchAndFilter;