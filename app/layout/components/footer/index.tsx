import React from 'react';
import LazyImage from '../../../components/lazy-image';
import './index.scss';

const Footer: React.FC = () => {
    const renderLogos = () => {
        const logoArr = [
            { name: 'CSS3', file: 'CSS3' },
            { name: 'HTML5', file: 'HTML5' },
            { name: 'JS', file: 'JS' },
            { name: 'React', file: 'React' },
            { name: 'sass', file: 'sass' },
            { name: 'Vite', file: 'Vite' },
            { name: 'Nuxt', file: 'Nuxt' },
            { name: 'Next', file: 'Nextjs' },
            { name: 'Uniapp', file: 'Uniapp' },
            { name: 'Taro', file: 'Taro' },
            { name: 'Nodejs', file: 'Nodejs' },
            { name: 'Python', file: 'Python' },
            { name: 'Docker', file: 'Docker' },
            { name: 'Arch Linux', file: 'ArchLinux' }
        ];

        return logoArr.map(({ name, file }) => (
            <div className="logos-items" key={name} title={name}>
                <LazyImage className="logos-icon" src={`/icon/${file}.webp`} alt={name} />
            </div>
        ));
    };

    return (
        <footer>
            <LazyImage className="logo" src="/icon/cat.webp" alt="logo" />
            <p className="tips">人生中最艰难的是选择</p>
            <div className="logos">{renderLogos()}</div>
            <p>Designed &amp; Powered by MeowGod</p>
            <p>
                &copy; 2022 · <a href="https://beian.miit.gov.cn">豫ICP备2022003917号</a>
            </p>
        </footer>
    );
};

export default Footer;
