import { FC, ChangeEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSerachString, setFilter, setSortString, sortValue } from '../store/slices/Filter'
const SearchAndSort: FC<{}> = props => {
    const { sort, search } = useAppSelector(state => state.filter.episode);
    const dispatch = useAppDispatch();
    const handleSearchOnInput = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilter({ name: 'episode', value: { name: event.target.value } }));

    }
    const handleSearchOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSerachString({ name: 'episode', value: event.target.value }));
    }
    const handleSortOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSortString({ name: 'episode', value: event.target.value as sortValue }));
    }
    return (
        <div>
            <div>
                <input type='text' value={search} onChange={handleSearchOnChange} onInput={handleSearchOnInput} placeholder='Enter episode name'></input>
                <button>Serch</button>
            </div>
            <select value={sort} onChange={handleSortOnChange}>
                <option value='name'>name</option>
                <option value='relese'>relese</option>
            </select>
        </div>
    );
}
export default SearchAndSort;