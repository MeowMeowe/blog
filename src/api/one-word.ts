import { get } from '@/utils/axios';
import { IWord } from '@/api-type/one-word';

export const getWordApi = () => get<IWord>('/api/sweet_word/randomOne', {});
