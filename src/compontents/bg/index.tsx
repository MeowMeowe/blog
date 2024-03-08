import { randomNumber } from '@/utils/utils';
import storageUtils from '@/utils/storage';
import './index.scss';

export default function Bg() {
    const bgNum = randomNumber(1, 7, 0);
    storageUtils.setSessionStorage('bgNum', bgNum);
    return (
        <div className="bg">
            <img className="bg-img" src={`/img/bg/${bgNum}.webp`} alt="bg" />
        </div>
    );
}
