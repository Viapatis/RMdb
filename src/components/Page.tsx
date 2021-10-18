import { FC } from 'react';
import Header from './Header';
import { useAppSelector } from '../store/hooks'
const Page: React.FC<{}> = props => {
    const { children } = { ...props };
    const { episodes } = useAppSelector(state => state.main);
    return (
        <div className="page">
            <Header></Header>
            <div className="page-content">{children}</div>
        </div>
    );
};

export default Page;