export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
}

export interface UserCreateResult {
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string;
}
