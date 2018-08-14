export interface Actor {
  id: string;
  firstName: string;
  lastName: string;
  born:  Date;
  died: Date;
  ocupations: string[];
  bio: string;
  portraitPath: string;
  roles: string[];
  directed: string[];
}

export interface ActorForAPI {
  id: string;
  firstName: string;
  lastName: string;
  born:  string;
  died: string;
  ocupations: string[];
  bio: string;
  portraitPath: string;
  roles: string[];
  directed: string[];
}
