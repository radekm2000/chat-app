export type CreateUserDetails = {
  username: string;
  password: string;
};

export type FindUserParams = Partial<{
  username: string;
  id: number;
}>;

export type LoginUserParams = {
  username: string;
  password: string;
};
