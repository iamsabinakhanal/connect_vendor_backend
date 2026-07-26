import { RequestContext } from "../dtos/request_context";

declare global {
  namespace Express {
    interface Request {
      context?: RequestContext;
    }
  }
}

export {};
