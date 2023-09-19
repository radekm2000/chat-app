import { Message } from 'src/utils/entities/message.entity';
import {
  CreateMessageParams,
  CreateMessageResponse,
} from 'src/utils/types/types';

export interface IMessageService {
  createMessage(params: CreateMessageParams): Promise<CreateMessageResponse>;

  getMessages(userId: number): Promise<Message[]>;
}
