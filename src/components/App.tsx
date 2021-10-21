import { FC, useEffect } from 'react';
import { getEpisodes } from '../store/slices/Episodes'
import Main from './Main';
import { useAppSelector, useAppDispatch } from '../store/hooks'
export const App: FC<{}> = props => {
    const projectName = useAppSelector(state => state.app.projectInfo.name);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getEpisodes({}));
    });
    return (
        <div className={`app-${projectName}`}>
            <Main />
        </div>
    );
};
export default App;