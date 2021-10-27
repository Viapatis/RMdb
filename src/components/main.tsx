import { FC, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Page from './Page';
import { useLoadingData } from './hooks';
import SearchAndFilter from './SearchAndFilter';
import EpisodeListGroup from './EpisodeListGroup';
import Episode from './Episode';
export const Main: FC<{}> = props => {
    const loadData = useLoadingData();
    useEffect(() => {
        loadData();
    });

    return (
        <div
            className='main'
            style={{ height: '100%' }}
        >
            <Page>
                <Switch>
                    <Route exact path='/'>
                        <SearchAndFilter type='episode' />
                        <EpisodeListGroup />
                    </Route>
                    <Route path='/episode'>
                        <Episode />
                    </Route>
                    <Route path='/character'></Route>
                    <Route path='/location'></Route>
                </Switch>
            </Page>

        </div>
    );
};
export default Main;