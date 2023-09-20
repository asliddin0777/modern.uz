import IProduct from "./Product/IProduct";

export default interface IUser {
  id: string;
  fullName: string;
  phoneNumber: number;
  basket: IProduct[]
}
w