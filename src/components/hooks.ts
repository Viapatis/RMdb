import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
    getCharactersWithLocation,
    getLocationsWithCharacters,
    getEpisodesByFilter,
    getEpisodeWithCharacters,
    setUrlSerch,
    clearRecivedData
} from '../store/slices/Main'
import { useLocation, useHistory } from 'react-router-dom';
import { FilterParams } from '../lib/apiTypes';
export type PageName = 'episode' | 'location' | 'character' | 'home';
export function useLoadingData() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const filter = useAppSelector(state => state.main.urlSerch);
    return async () => {
        const { pathname } = location;
        const pageName = getPageName(pathname);
        if (pageName !== 'home') {
            const id = getId(pathname, pageName);
            console.log(pageName, id);
            switch (pageName) {
                case 'episode':
                    dispatch(getEpisodeWithCharacters(id));
                    break;
                case 'location':
                    dispatch(getLocationsWithCharacters(id));
                    break;
                case 'character':
                    dispatch(getCharactersWithLocation(id));
                    break;
                default:
                    break;
            }
        }
        else {
            await dispatch(getEpisodesByFilter(filter));

        }
    }
}

export function useUpdatingPath() {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const location = useLocation();
    return (pathname: string | FilterParams, search?: FilterParams) => {
        if (location.pathname !== pathname && pathname && typeof pathname === 'string') {
            history.push(pathname);
            dispatch(clearRecivedData());
        }
        dispatch(setUrlSerch(search ? search : typeof pathname !== 'string' ? pathname : {}));
    }
}
function getPageName(path: string): PageName {
    const pathWord = path.split('/');
    const matchPageName = pathWord[1].match(/^(episode|location|character)/);
    return matchPageName ? pathWord[1] as PageName : 'home';
}
function getId(path: string, pageName: PageName): number {
    const pattern = new RegExp(`${pageName}/(\\d+)`)
    const matchArr = path.match(pattern);
    return matchArr ? +matchArr[1] : 0;
}