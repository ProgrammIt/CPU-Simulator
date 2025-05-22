export interface Message {
    to: number;
    from: number | null;
    forwardedBy: number;
    action: Action;
    payload: Map<string, string>;
}

export enum Action {
    UPDATE,
    DISABLE,
    ENABLE
}