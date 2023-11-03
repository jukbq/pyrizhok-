export interface MethodCookinRequest {
    methodCookinName: string;
    methodCookinLink: string;
    image: string;
}
export interface MethodCookinResponse extends MethodCookinRequest {
    id: number | string;
}