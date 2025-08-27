export const BaseUrl = 'http://localhost:3000';

export const LOGIN_PATH = `/api/auth/login`;
export const REGISTER_PATH = `/api/auth/register`;

export const USERLIST= '/api/users';
export const USERDETAIL= (userid: number)=> `/api/users/${userid}`
export const USER_CONVERSATIONS= (userId: number) => `/api/users/conversation/${userId}`
export const USER_LIST_BY_CONVERSATION= (convId: number)=> `/api/users/conversation/${convId}`


export const CONVERSATIONS_PATH = `/api/conversations`;
export const CONVERSATIONS_DETAIL= (id: number)=> `/api/conversations/${id}`

export const CREATEGROUP= '/api/conversations/group'
export const CREATEUSERCONV= '/api/conversations/user'
export const GETCONV= '/api/conversations/'

export const MESSAGES_PATH = (conversationId: number) => `/api/messages/${conversationId}/messages`;
export const MESSAGE_SEND= '/api/messages/send'
export const MESSAGE_READ= '/api/messages/read'

export const NOTIFICATION=  '/api/notifications'
export const READ_NOTIFICATION= (notiId:number)=> `/api/notifications/${notiId}/read`
export const READ_ALL= '/api/notifications/read-all'

export const EVENTS= '/api/events'
export const EVENTS_DETAILS= (eventId: number)=> `/api/events/${eventId}`
export const CREATE_EVENTS= `/api/events/create`
export const CONFIRM_EVENTS= `/api/events/confirm`