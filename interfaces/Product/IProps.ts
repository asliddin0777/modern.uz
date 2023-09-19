export default interface IProps {
  type: string;
  options: [IOption];
  label: string;
}
export interface IOption {
  label: string;
  value: string;
}
