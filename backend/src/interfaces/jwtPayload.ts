interface JWTPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export default JWTPayload;