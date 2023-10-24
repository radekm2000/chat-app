import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import multer, { MulterError, diskStorage } from 'multer';
import { giveUuid } from 'src/utils/uuid';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

// const multerStorage = multer.diskStorage({
//   destination: function (req: Request, file: Express.Multer.File, cb) {
//     cb(null, `${__dirname}/../../public/posts/single`);
//   },
//   filename: function (req: Request, file: Express.Multer.File, cb) {
//     const ext = file.mimetype.split('/')[1];
//     const filename = generateFileName(file.originalname);
//     req.body.image = filename;
//     req.body.images = [];
//     cb(null, filename);
//   },
// });

const generateFileName = (originalname: string) => {
  const fileExtension = path.extname(originalname);
  return `${uuid()}${fileExtension}`;
};

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
  }

  cb(null, true);
};

// export const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: { fileSize: 1024 * 1024 * 5, files: 1 },
// });

// export const uploadPostImageDisk = upload.single('image');

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: 5242880, //5mb
  },
  fileFilter(
    req: Request,
    file: Express.Multer.File,
    done: (error: Error, acceptFile: boolean) => void,
  ) {
    if (!file.mimetype.startsWith('image')) {
      done(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    } else {
      done(null, true);
    }
  },
  storage: diskStorage({
    destination(
      Request: Request,
      file: Express.Multer.File,
      done: (error: Error | null, filename: string) => void,
    ) {
      const repoPath = path.resolve(process.cwd());
      const uploadPath = path.join(repoPath, '\\src\\uploads\\temp');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      done(null, uploadPath);
    },
    filename(req: Request, file, done) {
      done(null, generateFileName(file.originalname));
    },
  }),
};
