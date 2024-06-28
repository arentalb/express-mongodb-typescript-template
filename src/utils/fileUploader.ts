import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: "./public/images/",
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const fileName =
      "\\" +
      file.originalname.split(".")[0] +
      "-" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    checkFileType(file, cb);
  },
});

function checkFileType(
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  const filetypes = /jpeg|jpg|png|gif|avif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"));
  }
}

const __dirname = path.resolve();
export const deleteImage = (filename: string): void => {
  const filePath = path.join(__dirname, "", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete image: ${filename}`, err);
    } else {
      console.log(`Successfully deleted image: ${filename}`);
    }
  });
};

export default upload;
