
export interface UserType {
    name: string;
    email: string;
    password?: string;
    role?: 'freelancer' | 'client' | 'admin';
    isBlocked?: false;
    createdAt?: Date;
    updatedAt?: Date;
}