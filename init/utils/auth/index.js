const TOKEN = 'access_token';
export const getToken = () => localStorage.getItem(TOKEN);
export const setToken = (token) => localStorage.setItem(TOKEN, token);