import { get } from '@/static/js/axios';
import { IWord } from '@/api-type/one-word';

export const getWordApi =()=> get<IWord>('https://meowgod.com/api/sweet_word/randomOne', {});