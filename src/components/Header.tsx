import { FC } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks'
import logo from  '../logo.png'
const Header: FC<{}> = props => {
    const name = useAppSelector(state => state.main.projectInfo.name)
    return (
        <div className='header'>
            <div className='header_logo-and-name'>
                <img className='header-logo' src={logo} />
                {name}
            </div>
        </div>
    );
};

export default Header;