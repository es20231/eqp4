export default function ObjToQueryParam(obj: { [key: string]: any }) {
  if (obj === null || obj === undefined) return "";

  const queryParam = <string[]>[];

  Object.keys(obj).forEach((key) => {
    if (
      obj[key] !== undefined &&
      obj[key] !== null &&
      obj[key] !== "" &&
      obj[key].length > 0
    )
      queryParam.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
      );
  });

  if (queryParam.length > 0) return "?" + queryParam.join("&");
  else return "";
}
