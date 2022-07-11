export class ErrorResponseClass {
  message: string
  status: number

  constructor({ message, status }: ErrorResponse) {
    this.message = message
    this.status = status
  }
}

export interface ErrorResponse {
  message: string
  status: number
}
