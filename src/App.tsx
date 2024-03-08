import Layout from './layout/layout';
import '@/assets/style/base.scss';
import './App.scss';
import { Provider } from 'react-redux';
import store from './store';

export default function App() {
    console.log('app render');
    return (
        <Provider store={store}>
            <Layout />
        </Provider>
    );
}
