import { Movie } from './movie.model';

export interface Rent {
  id: string;
  user: string;
  rentDay: string;
  movie: Movie;
  duration: number;
}
