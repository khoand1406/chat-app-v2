export const BaseUrl = 'http://localhost:3000/api';

export const LOGIN_PATH = `/auth/login`;
export const REGISTER_PATH = `/auth/register`;

export const USERLIST= '/users';
export const USERDETAIL= (userid: number)=> `/users/${userid}`
export const USER_CONVERSATIONS= (userId: number) => `/users/conversation/${userId}`

export const CONVERSATIONS_PATH = `/conversations`;
export const CREATEGROUP= '/conversations/group'
export const CREATEUSERCONV= '/conversations/user'
export const GETCONV= '/conversations/'

export const MESSAGES_PATH = (conversationId: number) => `/messages/${conversationId}/messages`;
export const MESSAGE_SEND= '/messages/send'