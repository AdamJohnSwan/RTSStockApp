export type ApiErrorResponse = {
    type: string;
    title: string;
    status: number;
    errors?: {
        [key: string]: string[]
    };
    detail?: string;
};

export const isApiErrorResponse = (response: any): response is ApiErrorResponse =>
    typeof response === 'object' && response !== null &&
    response.hasOwnProperty('type') && typeof response.title === 'string' &&
    response.hasOwnProperty('title') && typeof response.title === 'string';

export const isValidationError = (response: any): response is ApiErrorResponse =>
    isApiErrorResponse(response) &&
    response.hasOwnProperty('errors') && typeof response.errors === 'object';