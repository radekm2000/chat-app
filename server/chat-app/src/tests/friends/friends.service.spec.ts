import { HttpException } from '@nestjs/common';
import { FriendsService } from 'src/friends/services/friends.services';

describe('friend service DELETE method', () => {
  it('should throw an exception if friend Record is not found', async () => {
    const friendRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(null),
    } as any;
    const friendService = new FriendsService(friendRepositoryMock);
    const authUserMock = {
      id: 1,
    } as any;
    const friendRecordId = 3;
    try {
      await friendService.deleteFriend(authUserMock, friendRecordId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual(
        'Cannot delete friend record that doesnt exist',
      );
    }
  });

  it('should delete friendRecord and return it', async () => {
    const authUserMock = {
      id: 1,
    } as any;
    const friendRecordMock = {
      id: 3,
      senderId: authUserMock.id,
      receiverId: 2,
    };
    const friendRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(friendRecordMock),
      delete: jest.fn(),
    } as any;
    const friendService = new FriendsService(friendRepositoryMock);
    const friendRecordId = 3;

    const response = await friendService.deleteFriend(
      authUserMock,
      friendRecordId,
    );
    expect(response.friendRecord).toEqual(friendRecordMock);
  });
});
