import { FC} from 'react';
import Main from './Main';
import { useAppSelector } from '../store/hooks'
import '../styles/App.css'
export const App: FC<{}> = props => {
    const projectName = useAppSelector(state => state.app.projectInfo.name);
    return (
        <div className={`app ${projectName.replace(/([A-Z][a-z])/g,'-$1')}`}>
            <Main />
        </div>
    );
};
export default App;