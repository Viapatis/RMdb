import { FC, useEffect } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { getCharactersById, getLocationsById, getEpisodes } from '../store/slices/main'
import Page from './Page';
import { unwrapResult } from '@reduxjs/toolkit'
import { QueryParams, EpisodeData } from '../lib/apiCall'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { SearchAndFilter } from './SearchAndFilter';
const getEpisodesConcat = (param?: QueryParams) => {
    const episodes = useAppSelector(state => state.main.episodes);
    return getEpisodes({ episodesData: episodes.data, params: param });
}
export const Main: FC<{}> = props => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    useEffect(() => {
        history.listen(async (location) => {
            const pathname = location.pathname;
            const urlPathWord = pathname.split('/');
            if (location.pathname.match(/^\/(episode|location|character)\/\d+$/)) {
                let result;
                const id = +urlPathWord[2];
                switch (urlPathWord[1]) {
                    case 'episode':
                        result = await dispatch(getEpisodesConcat(id));
                        if (getEpisodes.fulfilled.match(result)) {
                            const episode = unwrapResult(result).response as EpisodeData;
                            await dispatch(getCharactersById(episode.characters as number[]));
                        }
                        break;
                    case 'location':
                        result = await dispatch(getLocationsById([id]));
                        if (getLocationsById.fulfilled.match(result)) {
                            const locationData = (unwrapResult(result))[0];
                            await dispatch(getCharactersById(locationData.residents as number[]));
                        }
                        break;
                    case 'character':
                        result = await dispatch(getCharactersById([id]));
                        if (getCharactersById.fulfilled.match(result)) {
                            const character = unwrapResult(result)[0];
                        }
                        break;
                    default:
                        break;
                }
            }
            else if (pathname.match(/\//)) {
                console.log('Home');
                dispatch(getEpisodesConcat());
            }
        })
        dispatch(getEpisodesConcat());
    });
    return (
        <main className='main' style={{ height: '100%' }}>
            <Switch>
                <Route exact path='/'>
                    <Page>
                        <SearchAndFilter />
                        
                    </Page>
                </Route>
                <Route path='/episode'><Page></Page></Route>
                <Route path='/character'><Page></Page></Route>
                <Route path='/location'><Page></Page></Route>
            </Switch>
        </main>
    );
};
export default Main;