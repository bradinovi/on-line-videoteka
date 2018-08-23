export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string; // must be ISO-8601 date string
}

export interface AuthData {
  email: string;
  password: string;

}
