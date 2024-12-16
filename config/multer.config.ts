import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerStorage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
    callback(null, filename);
  },
});

export const fileFilter = (req, file, callback) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    callback(null, true);
  } else {
    callback(new BadRequestException('Разрешены только изображения!'), false);
  }
};

export const fileFieldsConfig = [
  { name: 'previewImage', maxCount: 1 },
  { name: 'images', maxCount: 3 },
];
