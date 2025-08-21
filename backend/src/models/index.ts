import { Attendance } from './attendence.model';
import { Conversation } from './conversation.model';
import { Events } from './event.model';
import { Message } from './message.model';
import { Notification } from './notification.model';
import { Role } from './role.model';
import { Token } from './token';
import { User } from './user.model';
import { UserConversation } from './userconversation.model';
import { UserMessages } from './usermessages';
import { UserRoles } from './userroles.model';

export const models = [
  Role,
  Conversation,
  UserConversation,
  User,
  UserRoles,
  Message,
  UserMessages,
  Token, 
  Notification,
  Events,
  Attendance
];
