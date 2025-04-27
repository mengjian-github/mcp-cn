export const login = () => {
};

export type UserInfo = {
  is_login: boolean;
  user_id: string;
  user_name: string;
};

export const checkLogin = (): Promise<UserInfo['is_login']> =>
  Promise.resolve(true);

export const getUserInfo = (): Promise<UserInfo> =>
  Promise.resolve({
    is_login: true,
    user_id: '123',
    user_name: 'test',
  });

export const logout = () => {
};
