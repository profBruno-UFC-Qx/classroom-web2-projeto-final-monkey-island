import multer from "multer";
import crypto from "crypto";
import path from "path";

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("esse daqui é do multer:" + path.resolve("public", "tmp"));
    cb(null, path.resolve("public", "tmp"));
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString("hex");
    const fileExtension = path.extname(file.originalname);
    const uniqueName = `${randomName}${fileExtension}`;
    cb(null, uniqueName);
  },
});

export default { storage: multerConfig };
