import { renderLayout } from './layout/layout';
import '@/assets/style/base.scss';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store';

export default function App() {
    return <Provider store={store}>{renderLayout()}</Provider>;
}
