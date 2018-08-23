import { Movie } from './movie.model';

export interface Rent {
  id: string;
  user: any;
  rentDay: string;
  movie: Movie;
  duration: number;
}
