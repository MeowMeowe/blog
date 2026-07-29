'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './index.scss';
import LazyImage from '@/components/lazy-image';

interface GameItem {
    gameName: string;
    icon: string;
    link: string;
}

const Game: React.FC = () => {
    const router = useRouter();

    const gameList: GameItem[] = [
        {
            gameName: '提莫快跑',
            icon: '', // Add the path to the game icon
            link: '' // Add the game link
        }
    ];

    const handleJumpToGame = (link: string) => {
        router.push(`/game${link}`);
    };

    return (
        <div className="game">
            {gameList.map((item) => (
                <div className="game-items" key={item.gameName} onClick={() => handleJumpToGame(item.link)}>
                    <LazyImage className="game-items-icon" src={item.icon} alt="gamelogo" />
                    <p className="game-items-name">{item.gameName}</p>
                </div>
            ))}
        </div>
    );
};

export default Game;
