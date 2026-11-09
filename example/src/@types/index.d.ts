interface Person {
  id: number;
}

interface Pet {
  id: number;
  owner_id: number;
}

export interface DB {
  person: Person;
  pet: Pet;
}
