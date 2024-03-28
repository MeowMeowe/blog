import { get } from '@/utils/axios';
import { IWord } from '@/api-type/one-word';

export const getWord = () => get<IWord>('/word', {});
