export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
}

export interface SocialsDTO {
  applePodcast?: string;
  facebook?: string;
  instagram?: string;
  link?: string;
  linkedin?: string;
  mailTo?: string;
  pinterest?: string;
  spotify?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
}

export interface UpdateCreatorProfileDTO {
  fullName?: string;
  profileImage?: string;
  bio?: string;
  socials?: SocialsDTO;
}

export interface UpdateUserDTO {
  creatorProfile: UpdateCreatorProfileDTO;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  username: string;
  role: string;
}
