import { FC } from 'react';
import { useAppSelector } from '../store/hooks'
import logo from '../logo.png'
import { useHistory } from 'react-router';
const Header: FC<{}> = props => {
    const history = useHistory();
    const name = useAppSelector(state => state.app.projectInfo.name);
    const onClickLogo = () => {
        history.push('/');
    }
    return (
        <div className='header'>
            <div className='header_logo-and-name' onClick={onClickLogo}>
                <img className='header-logo' src={logo} />
                {name}
            </div>
        </div>
    );
};

export default Header;