export interface Role {
  id: string;
  movie: string;
  actor: string;
  name: string;
}

export interface RoleOfMovie {
  id: string;
  movie: string;
  actor: { _id: string, firstName: string, lastName: string };
  name: string;
}

export interface RoleOfActor {
  id: string;
  movie: { _id: string, title: string };
  actor: string;
  name: string;
}
