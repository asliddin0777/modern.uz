import IProductMedia from "../Product/IProducMedia";

export default interface IReview {
  id: string;
  createdDate: Date;
  review: string;
  rating: number;
  imgs?: Array<IProductMedia>;
}
