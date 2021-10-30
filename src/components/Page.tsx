import { FC, useEffect } from 'react';
import Header from './Header';
import '../styles/Page.css';
import { useAppSelector } from '../store/hooks';
import { useUpdatingPath } from './hooks';
const Page: FC<{}> = props => {
    const { children } = { ...props };
    const search = useAppSelector(state => state.main.urlSerch)
    const info = useAppSelector(state => state.main.info);
    const { requestInfo, pageLoadAllowed } = useAppSelector(state => state.main);
    const { status } = requestInfo;
    const updatePath = useUpdatingPath();
    const onScroll = (event: Event) => {
        if (event.currentTarget) {
            const scrollingElement = (event.currentTarget as Document).scrollingElement;
            if (scrollingElement) {
                const { scrollHeight, scrollTop, clientHeight } = scrollingElement;
                if (scrollTop > scrollHeight - clientHeight - 1)
                    if (info.next && status !== 'pending') {
                        const serchParams = status === 'rejected' ?
                            { page: '' + info.next } :
                            { ...search, page: '' + info.next };
                        updatePath(serchParams);
                    }
            }
        }
    }
    useEffect(() => {
        if (pageLoadAllowed)
            document.addEventListener('scroll', onScroll);
        return () => {
            if (pageLoadAllowed)
                document.removeEventListener('scroll', onScroll);
        };
    });
    return (
        <div className="page">
            <Header></Header>
            <div className="page-content">
                {children}
                {status === 'pending' ? <div className='page-load'>
                    <div className="load-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div> : ''}
            </div>
        </div>
    );
};

export default Page;