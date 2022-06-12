import { extname } from "path";
import { UsersService } from "./users.service";

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error("Only image files are allowed!"), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = req.user.user_name;
  const fileExtName = extname(file.originalname);
  callback(null, `${name}${fileExtName}`);
};
