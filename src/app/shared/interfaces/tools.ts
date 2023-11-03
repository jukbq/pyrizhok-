export interface ToolsRequest {
    toolsName: string;
    toolsCookinLink: string;
    image: string;
}
export interface ToolsResponse extends ToolsRequest {
    id: number | string;
}