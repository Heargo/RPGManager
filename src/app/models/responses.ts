//response type wich as a value (error or success) and a message

export interface Response {
    value: string;
    type: ResponseType;
}

//ResponseValue is a enum
export enum ResponseType {
    Success = "success",
    Error = "error"
}