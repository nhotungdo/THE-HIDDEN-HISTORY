import c1 from './chapters/chapter-1-1930.json';
import c2 from './chapters/chapter-2-1945.json';
import c3 from './chapters/chapter-3-1954.json';
import c4 from './chapters/chapter-4-1975.json';
import c5 from './chapters/chapter-5-1986.json';
import { validateChapters } from './validateChapters';
const data: unknown = [c1, c2, c3, c4, c5];
validateChapters(data);
export const chapters = data;
