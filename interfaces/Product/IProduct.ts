import IVendor from "../Vendor/IVendor";
import IPrice from "./IPrice";
import IProductMedia from "./IProducMedia";
import IProps from "./IProps";
import IReview from "../Review/IReview";
import IFormatedProps from "./IFormatedProps";

export default interface IProduct {
  id: string;
  likes: string[]
  vendorId: IVendor["id"];
  name: string;
  subcategory: {
    name:string
  }
  description: string;
  price: Array<IPrice>;
  media: Array<IProductMedia>;
  video: IProductMedia;
  category: {
    name: string
    id: string
  }
  props: Array<IFormatedProps>;
  author: string
  review: Array<IReview>;
}
