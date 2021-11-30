interface Person {
  id: number;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
}

interface Pet {
  id: number;
  name: string;
  owner_id: number;
  species: 'dog' | 'cat';
}

interface Movie {
  id: string;
  stars: number;
}

export interface Database {
  person: Person;
  pet: Pet;
  movie: Movie;
}
