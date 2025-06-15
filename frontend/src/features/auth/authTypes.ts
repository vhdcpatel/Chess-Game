export interface UserInfo {
  // id: string;
  // name: string;
  // rating: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthState {
  authToken: string | null;
  user: UserInfo | null;
}


// Request Response
export interface SingUpCallPayLoad {
  firstName: string,
  lastName: string,
  userName: string,
  email: string,
  password: string,
}

export interface LoginCallPayLoad {
  email: string,
  password: string,
}
