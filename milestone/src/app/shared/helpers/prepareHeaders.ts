import { loadFromStorage } from './lockalStorage';

export const getHeaders = () => {
  const user = loadFromStorage();
  return {
    'rs-uid': user.uid ?? '',
    'rs-email': user.email ?? '',
    Authorization: 'Bearer ' + user.token ?? '',
  };
};
