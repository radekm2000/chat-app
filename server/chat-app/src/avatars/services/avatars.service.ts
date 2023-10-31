import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { s3 } from 'src/main';
import { Avatar } from 'src/utils/entities/avatar.entity';
import { Repository } from 'typeorm';

const bucketName = process.env.BUCKET_NAME;

@Injectable()
export class AvatarsService {
  constructor(
    @InjectRepository(Avatar) private avatarsRepository: Repository<Avatar>,
  ) {}

  async getAvatars() {
    const avatars = await this.avatarsRepository.find({});

    if (avatars.length === 0) {
      return { message: 'No avatars found' };
    }
    return avatars;
  }

  async getAvatar(avatarId: number) {
    const avatar = await this.avatarsRepository.findOne({
      where: {
        id: avatarId,
      },
    });

    if (!avatar) {
      return { message: 'No avatar found' };
    }

    const getObjectParams = {
      Bucket: bucketName,
      Key: avatar.imageName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    avatar.imageUrl = url;
    console.log(avatar.imageUrl);
    return avatar.imageUrl;
  }
}
