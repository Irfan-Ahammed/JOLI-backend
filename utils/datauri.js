import DataURIParser from "datauri/parser.js";
import path from "path";

const getDatauri = (file) => {
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname);
    return parser.format(extName, file.buffer); // Ensure `file.buffer` exists
  };
  
export default getDatauri;
