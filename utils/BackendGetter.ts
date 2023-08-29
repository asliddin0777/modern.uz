import axios from "axios";

interface API {
  api: string;
  get: string;
}

const backGetter = async ({ api, get }: API) => {
  let res: any;
  await axios
    .get(`${api}${get ? `/${get}` : ""}`)
    .then((res: any) => (res = res))
    .catch(() => {
      res = res;
    });
  return res;
};

export default backGetter;
