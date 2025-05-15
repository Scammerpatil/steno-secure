import { Ride } from "./Ride";
import { User } from "./user";

export interface Booking {
  _id: string;
  ride: Ride;
  user: User;
  owner: User;
  approved: boolean;
  payment: boolean;
}
