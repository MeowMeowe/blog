import FirstSight from './compontents/top-screen';
import ArticleList from './compontents/article-list';
import './index.scss';

export default function Home() {
    return (
        <div className="home">
            <FirstSight />
            <ArticleList />
        </div>
    );
}
