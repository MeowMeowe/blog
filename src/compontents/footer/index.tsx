import './index.scss';

export default function Footer() {
    const renderLogos = () => {
        const logoArr: string[] = ['CSS3', 'HTML5', 'JS', 'React', 'sass', 'Vite'];
        return logoArr.map((v) => {
            return (
                <div className="logos-items" key={v} title={v}>
                    <img className="logos-icon" src={`/img/icon/${v}.webp`} alt={v} />
                </div>
            );
        });
    };

    return (
        <div className="footer">
            <img className="footer-logo" src="/img/icon/cat.webp" alt="logo" />
            <p className="">人生中最艰难的是选择</p>
            <div className="logos">{renderLogos()}</div>
            <p>Designed & Powerd by MeowGod </p>
            <p>
                &copy; 2022 · <a href="https://beian.miit.gov.cn">豫ICP备2022003917号</a>
            </p>
        </div>
    );
}
