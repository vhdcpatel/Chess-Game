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
