import FirstSight from './compontents/top-screen';
import ArticleList from './compontents/article-list';
// import { increment, asyncIncrement, decrement } from '@/store/slices/counte.slice';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
import './index.scss';

export default function Home() {
    // const { count } = useAppSelector((state) => state.counter);
    // const dispatch = useAppDispatch();
    return (
        <div className="home">
            {/* <button onClick={() => dispatch(increment(2))}>{count}</button>
            <br />
            <button onClick={() => dispatch(asyncIncrement(1))}>{count}</button>
            <br />
            <button onClick={() => dispatch(decrement(1))}>{count}</button> */}
            <FirstSight />
            <ArticleList />
        </div>
    );
}
