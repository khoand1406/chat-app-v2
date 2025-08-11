export const BaseUrl = 'http://localhost:3000';

export const LOGIN_PATH = `/api/auth/login`;
export const REGISTER_PATH = `/api/auth/register`;

export const USERLIST= '/api/users';
export const USERDETAIL= (userid: number)=> `/api/users/${userid}`
export const USER_CONVERSATIONS= (userId: number) => `/api/users/conversation/${userId}`

export const CONVERSATIONS_PATH = `/api/conversations`;
export const CREATEGROUP= '/api/conversations/group'
export const CREATEUSERCONV= '/api/conversations/user'
export const GETCONV= '/api/conversations/'

export const MESSAGES_PATH = (conversationId: number) => `/api/messages/${conversationId}/messages`;
export const MESSAGE_SEND= '/api/messages/send'