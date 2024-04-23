import React from 'react';
import LazyImage from '../lazy-image';
import './index.scss';

const Footer: React.FC = () => {
    const renderLogos = () => {
        const logoArr: string[] = ['CSS3', 'HTML5', 'JS', 'React', 'sass', 'Vite'];
        return logoArr.map((v) => (
            <div className="logos-items" key={v} title={v}>
                <LazyImage className="logos-icon" src={`/icon/${v}.webp`} alt={v} />
            </div>
        ));
    };

    return (
        <footer>
            <LazyImage className="logo" src="/icon/cat.webp" alt="logo" />
            <p className="tips">人生中最艰难的是选择</p>
            <div className="logos">{renderLogos()}</div>
            <p>Designed & Powerd by MeowGod </p>
            <p>
                &copy; 2022 · <a href="https://beian.miit.gov.cn">豫ICP备2022003917号</a>
            </p>
        </footer>
    );
};

export default Footer;
