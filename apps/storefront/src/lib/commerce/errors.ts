/**
 * An error whose message is written for the customer (French, no technical detail).
 * The actions show its message as is; any other error is logged and replaced by a generic message,
 * so a Medusa or network failure never reaches the screen in English or with internal details.
 */
export class CustomerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomerError";
  }
}
