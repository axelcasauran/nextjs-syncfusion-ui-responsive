import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar?: string | null;
      roleId?: string | null;
      roleName?: string | null;
      status: string;
      gender: string;
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    roleId?: string | null;
    status: string;
    gender: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    roleId?: string | null;
    roleName?: string | null;
    status: string;
    gender: string;
  }
}
