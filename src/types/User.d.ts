export interface User {
  _id?: string;
  name: string;
  email: string;
  contact: string;
  profileImage: string;
  address: string;
  aadharCard: {
    number: string;
    image: string;
  };
  password: string;
  otp?: string;
}
