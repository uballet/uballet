export type User = {
  id: string;
  email: string;
  verified: boolean;
};

export type UserAndToken = User & { token: string };

export type UserPasskey = {
  id: string;
  name: string;
  registeredAt: Date;
};

export type Contact = {
  id: string;
  name: string;
  address: string;
};
