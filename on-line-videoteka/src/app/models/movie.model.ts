export interface Movie {
  id: string;
  title: string;
  release: string;
  duration: number;
  trailerLink: string;
  plotsum: string;
  genres: string[];
  posterPath: string;
  rents: number;
}

export interface MovieForAPI {
  id: string;
  title: string;
  release: string;
  duration: number;
  trailerLink: string;
  plotsum: string;
  genres: { genres: string[] };
  posterPath: string;
  rents: number;
}
