import IFormatedProps from "./IFormatedProps";
import IPropValue from "./IPropValue";

export interface ISubcategory {
    id:string;
    name:string;
    props: IFormatedProps[];
}