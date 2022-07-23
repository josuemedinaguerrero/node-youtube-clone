import { Error } from "../types/types";

export const createError = (status: number, message: string) => {
   const err = new Error() as Error;
   err.status = status;
   err.message = message;
   return err;
};
