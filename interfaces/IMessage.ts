import IChat from "./IChat";
import IUser from "./IUser";

export interface IMessage {
    id?: string;
    sender: IUser["id"];
    reciever: IUser["id"];
    message: string;
    chat?: IChat["id"];
    file: string;
    createdAt: string
  }