import { User } from "./User";

export interface Ride {
  _id?: string;
  organiser?: User;
  title: string;
  date: Date;
  time: string;
  from: string;
  to: string;
  car: {
    name: string;
    number: string;
    capacity: number;
  };
  passengers: User[];
  pricePerSeat: number;
  isFull: boolean;
  status: string;
}
