import { FC, useEffect, UIEvent, useRef } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { getCharactersWithLocation, getLocationsWithCharacters, getEpisodesByFilter, getEpisodeWithCharacters } from '../store/slices/Main'
import Page from './Page';
import { genQueryObj } from '../lib/tools'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import SearchAndSort from './SearchAndFilter';
import EpisodeListGroup from './EpisodeListGroup';
import { setLoadAllowed } from '../store/slices/Main'
export const Main: FC<{}> = props => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const info = useAppSelector(state => state.main.info);
    const loadAllowed = useAppSelector(state => state.main.loadAllowed);
    const onScrollMain = (event: UIEvent<HTMLDivElement>) => {
        const divMain = (event.target as HTMLDivElement);
        const { scrollHeight, scrollTop, clientHeight } = divMain;
        if (scrollTop > scrollHeight - clientHeight - 1)
            if (info.next)
                history.push(`/?page=${info.next}`)
    }
    console.log(loadAllowed);
    useEffect(() => {
        const unlistenHistory = history.listen(async (location) => {
            const { pathname, search } = location;
            const urlPathWord = pathname.split('/');
            if (location.pathname.match(/^\/(episode|location|character)\/\d+$/)) {
                const id = +urlPathWord[2];
                switch (urlPathWord[1]) {
                    case 'episode':
                        dispatch(getEpisodeWithCharacters(id));
                        break;
                    case 'location':
                        dispatch(getLocationsWithCharacters(id));
                        break;
                    case 'character':
                        getCharactersWithLocation(id);
                        break;
                    default:
                        break;
                }
            }
            else if (pathname.match(/^\/$/)) {
                const searchMatch = search.match(/^\?(\w+=\w+&?)+/);
                if (searchMatch) {
                    const query = genQueryObj(searchMatch[1]);
                    await dispatch(getEpisodesByFilter(query));
                }
                else {
                    dispatch(getEpisodesByFilter());
                    dispatch(setLoadAllowed(true));
                }
            }
        })
        return () => {
            unlistenHistory()
        };
    });

    return (
        <div
            className='main'
            style={{ height: window.innerHeight, overflow: 'auto' }}
            onScroll={loadAllowed ? onScrollMain : undefined}
        >
            <Switch>
                <Route exact path='/'>
                    <Page>
                        <SearchAndSort />
                        <EpisodeListGroup />
                    </Page>
                </Route>
                <Route path='/episode'><Page></Page></Route>
                <Route path='/character'><Page></Page></Route>
                <Route path='/location'><Page></Page></Route>
            </Switch>
        </div>
    );
};

export default Main;