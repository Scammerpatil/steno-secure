export interface User {
  _id?: string;
  name: string;
  email: string;
  contact: string;
  profileImage: string;
  gender: string;
  dob: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  aadharCard: {
    number: string;
    image: string;
  };
  currentlyAllowed: boolean;
  examAttempts: {
    date: string;
    score: number;
    status: "pending" | "submitted" | "evaluated";
    isAllowed: boolean;
  }[];
  password: string;
  otp?: string;
}
