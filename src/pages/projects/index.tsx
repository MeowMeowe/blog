import { useNavigate } from 'react-router-dom';
import './index.scss';
import LazyImage from '@/compontents/lazy-image';

export default function Game() {
    const navigate = useNavigate();
    const gameList = [
        {
            gameName: '提莫快跑',
            icon: '',
            link: ''
        }
    ];
    const handleJumpToGame = (link: string) => {
        navigate(`/game${link}`);
    };
    return (
        <div className="game">
            {gameList.map((item) => {
                return (
                    <div
                        className="game-items"
                        key={item.gameName}
                        onClick={() => handleJumpToGame(item.link)}
                    >
                        <LazyImage className="game-items-icon" src={item.icon} alt="gamelogo" />
                        <p className="game-items-name">{item.gameName}</p>
                    </div>
                );
            })}
        </div>
    );
}
