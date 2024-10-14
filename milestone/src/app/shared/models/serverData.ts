export interface SuccessfulLogin {
  token: string;
  uid: string;
}

export interface IProfile {
  createdAt: { S: string };
  email: { S: string };
  name: { S: string };
  uid: { S: string };
}

export interface IGroups {
  Count: number;
  Items: IOneGroup[];
  ScannedCount?: number;
  $metadata?: {
    attempts: number;
    httpStatusCode: number;
    requestId: string;
    totalRetryDelay: number;
  };
}

export interface IOneGroup {
  id: Value;
  name: Value;
  createdAt: Value;
  createdBy: Value;
}

type Value = {
  S: string;
};

export interface IUsers {
  Count: number;
  Items: IOneUser[];
}

export interface IOneUser {
  name: Value;
  uid: Value;
}

export interface IConversations {
  Count: number;
  Items: IOneConvers[];
}

export interface IOneConvers {
  id: Value;
  companionID: Value;
}

export interface IMessagesResp {
  Count: number;
  Items: { authorID: Value; message: Value; createdAt: Value }[];
}
