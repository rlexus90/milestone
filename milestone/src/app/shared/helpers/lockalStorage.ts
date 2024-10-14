import { IProfile } from '../models/serverData';

export interface ISavedData {
  token: string;
  uid: string;
  email: string;
}

export interface ILoadData {
  token: string | null;
  uid: string | null;
  email: string | null;
}

export const saveToStorage = (data: ISavedData) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('uid', data.uid);
  localStorage.setItem('email', data.email);
};

export const loadFromStorage = (): ILoadData => {
  const token = localStorage.getItem('token');
  const uid = localStorage.getItem('uid');
  const email = localStorage.getItem('email');
  return { token, uid, email };
};

export const clearStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('uid');
  localStorage.removeItem('email');
  localStorage.removeItem('profile');
};

export const saveProfile = (profile: IProfile) => {
  localStorage.setItem('profile', JSON.stringify(profile));
};

export const loadProfile = () => {
  const profile = localStorage.getItem('profile');
  if (profile) return JSON.parse(profile);
  return null;
};
