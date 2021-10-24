import { FC } from 'react';
import logo from '../logo60.png'
import { useHistory } from 'react-router';
import '../styles/Header.css';
const Header: FC<{}> = props => {
    const history = useHistory();
    const onClickLogo = () => {
        history.push('/');
    }
    return (
        <div className='header-wrap'>
            <div className='header'>
                <div className='header_logo-and-name' onClick={onClickLogo}>
                    <img  alt='logo' className='header-logo' src={logo} />
                    <span className='header-name'>Rick and Morty</span>
                </div>
            </div>
        </div>
    );
};

export default Header;