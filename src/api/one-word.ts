import { get } from '@/utils/axios';
import { IWord } from './interface';

export const getWord = () => get<IWord>('/word', {});
