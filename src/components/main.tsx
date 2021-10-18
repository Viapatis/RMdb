import { FC, useEffect } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import Page from './Page';


export const Main: FC<{}> = props => {
    const history = useHistory();
    useEffect(() => {
        history.listen((location) => {
            const urlPathWord = location.pathname.split('/');
            if (urlPathWord.length > 1)
                const locactionPage = ;

        })
        return () => {

        }
    })
    return (
        <main className='main' style={{ height: '100%' }}>
            <Switch>
                <Route exact path='/'><Page></Page></Route>
                <Route path='/episode'><Page></Page></Route>
                <Route path='/characters'><Page></Page></Route>
                <Route path='/locations'><Page></Page></Route>
            </Switch>
        </main>
    );
};