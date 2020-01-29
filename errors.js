export class AppError extends Error {
  constructor (message, status) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.status = status || 500
  }
}

export class UserDoesNotExistError extends AppError {
  constructor (message) {
    super(message || 'User does not exist.', 400)
  }
}

export class AuthenticationError extends AppError {
  constructor (message) {
    super(message || 'Unauthorized', 401);
  }
}

