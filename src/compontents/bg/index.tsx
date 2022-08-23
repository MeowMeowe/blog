import { randomNumber } from '@/utils/utils';
import './index.scss';

export default function Bg() {
    return (
        <div className="bg">
            <img className="bg-img" src={`./img/bg/${randomNumber(1, 6, 0)}.webp`} alt="bg" />
        </div>
    );
}
