import {FC} from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks'
const Header: FC<{}> = props => {
    const name = useAppSelector(state => state.global.name)
    return (
        <div className='header'>
            <div className='header_logo-and-name'>
                <img className='header-logo' src='.../logo.png' />
                {name}
            </div>
        </div>
    );
};

export default Header;