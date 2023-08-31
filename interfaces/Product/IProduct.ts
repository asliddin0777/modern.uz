import IVendor from "../Vendor/IVendor";
import IPrice from "./IPrice";
import IProductMedia from "./IProducMedia";
import IProps from "./IProps";
import IReview from "../Review/IReview";

export default interface IProduct {
  id: string;
  vendorId: IVendor["id"];
  name: string;
  description: string;
  price: Array<IPrice>;
  media: Array<IProductMedia>;
  video: IProductMedia;
  category: {
    name: string
    id: string
  }
  props: Array<IProps>;
  author: string
  review: Array<IReview>;
}
