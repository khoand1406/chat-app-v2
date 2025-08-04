import { Conversation } from './conversation.model';
import { Message } from './message.model';
import { Role } from './role.model';
import { User } from './user.model';
import { UserConversation } from './userconversation.model';
import { UserRoles } from './userroles.model';

export const models = [
  Role,
  Conversation,
  UserConversation,
  User,
  UserRoles,
  Message
];
