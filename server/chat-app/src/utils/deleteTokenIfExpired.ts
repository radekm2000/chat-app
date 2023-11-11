import { config } from 'ormconfig';
import { DataSource, LessThan, MoreThan } from 'typeorm';
import { ResetPasswordToken } from './entities/resetPasswordToken.entity';

export const deleteTokenIfExpired = async () => {
  const dataSource = new DataSource(config);
  await dataSource.initialize();
  const tokenRepository = dataSource.getRepository(ResetPasswordToken);
  const expiredTokens = await tokenRepository.findOne({
    where: {
      createdAt: LessThan(new Date(Date.now() - 65 * 60 * 1000)),
    },
  });

  if (expiredTokens) {
    const deletedToken = await tokenRepository.remove(expiredTokens);
  }
};
