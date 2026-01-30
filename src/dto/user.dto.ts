export class CreateUserDTO {
  email!: string;
  username!: string;
  password!: string;
  firstName?: string;
  lastName?: string;
}

export class UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

export class LoginDTO {
  email!: string;
  password!: string;
}

export class UserResponseDTO {
  id!: string;
  email!: string;
  username!: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive!: boolean;
  createdAt!: Date;
}
