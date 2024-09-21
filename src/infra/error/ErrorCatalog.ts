import { CustomError } from '@/infra/error/CustomError'
import { HttpStatusCodes } from '@/infra/http/HttpStatusCodes'

export class DatabaseConnectionError extends CustomError {
  constructor () {
    super(HttpStatusCodes.InternalServerError, 'Database Connection Error')
  }
}

export class NotFoundError extends CustomError {
  constructor () {
    super(HttpStatusCodes.NotFound, 'Not found')
  }
}
