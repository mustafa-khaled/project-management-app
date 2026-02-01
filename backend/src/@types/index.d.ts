declare global {
  namespace Express {
    interface User extends import("../models/user.model").UserDocument {
      id?: string;
      _id?: any;
    }
  }
}

export {};
