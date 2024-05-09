/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable sort-keys */

import {
  UserCreate, apiBaseInstance,
} from '~/shared/api';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserStoreState {
  token: string;
  signUp: (userCreate: UserCreate) => Promise<void>;
}

export const useUserStore = create<UserStoreState>()(
  devtools(set => ({
    token: '',

    signUp: async (userCreate: UserCreate): Promise<void> => {
      console.log(import.meta.env.VITE_APP_API_BASE_URL);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result: string = await apiBaseInstance.post('/users/signup', userCreate).then(res => res.data);

      set(() => {
        return { token: result };
      });
    },
  })),
);
