import FirstSight from './compontents/top-screen';
import ArticleList from './compontents/article-list';
// import { increment, asyncIncrement, decrement } from '@/store/slices/counte.slice';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
import './index.scss';

export default function Home() {
    return (
        <div className="home">
            <FirstSight />
            <ArticleList />
        </div>
    );
}
