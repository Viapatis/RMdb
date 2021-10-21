import { FC } from 'react';
import Header from './Header';
const Page: FC<{}> = props => {
    const { children } = { ...props };
    return (
        <div className="page">
            <Header></Header>
            <div className="page-content">{children}</div>
        </div>
    );
};

export default Page;