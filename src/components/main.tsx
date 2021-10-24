import { FC, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { getCharactersWithLocation, getLocationsWithCharacters, getEpisodesByFilter, getEpisodeWithCharacters } from '../store/slices/Main'
import Page from './Page';
import { genQueryObj } from '../lib/tools'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import SearchAndFilter from './SearchAndFilter';
import EpisodeListGroup from './EpisodeListGroup';
import { setLoadAllowed } from '../store/slices/Main'
export const Main: FC<{}> = props => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const info = useAppSelector(state => state.main.info);
    const {loadAllowed,requestInfo} = useAppSelector(state => state.main);
    const onScroll = (event: Event) => {
        if (event.currentTarget) {
            const scrollingElement = (event.currentTarget as Document).scrollingElement;
            if (scrollingElement) {
                const { scrollHeight, scrollTop, clientHeight } = scrollingElement;
                if (scrollTop > scrollHeight - clientHeight - 1)
                    if (info.next&&requestInfo.status!=='pending')
                        history.push(`/?page=${info.next}`)
            }
        }
    }
    useEffect(() => {
        if (loadAllowed)
            document.addEventListener('scroll', onScroll);
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
            if (loadAllowed)
                document.removeEventListener('scroll', onScroll);
            unlistenHistory()
        };
    });

    return (
        <div
            className='main'
            style={{ height: '100%' }}
        >
            <Switch>
                <Route exact path='/'>
                    <Page>
                        <SearchAndFilter />
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