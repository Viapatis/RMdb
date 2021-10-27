import { FC } from 'react';
import logo from '../logo60.png'
import { useUpdatingPath } from './hooks';
import '../styles/Header.css';
const Header: FC<{}> = props => {
    const updatePath = useUpdatingPath();
    const onClickLogo = () => {
        updatePath('/');
    }
    return (
        <div className='header-wrap'>
            <div className='header'>
                <div className='header_logo-and-name' onClick={onClickLogo}>
                    <img alt='logo' className='header-logo' src={logo} />
                    <span className='header-name'>Rick and Morty</span>
                </div>
            </div>
        </div>
    );
};

export default Header;