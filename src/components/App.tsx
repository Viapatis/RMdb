import { FC } from 'react';
import { getEpisodesByFilter } from '../store/slices/Main'
import Main from './Main';
import { useAppSelector, useAppDispatch } from '../store/hooks'
import '../styles/App.css'
export const App: FC<{}> = props => {
    const projectName = useAppSelector(state => state.app.projectInfo.name);
    const dispatch = useAppDispatch();
    dispatch(getEpisodesByFilter({}));
    return (
        <div className={`app-${projectName}`}>
            <Main />
        </div>
    );
};
export default App;