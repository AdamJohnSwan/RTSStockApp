export type ApiErrorResponse = {
    type: string;
    title: string;
    status: number;
    detail?: string;
};

export type ApiValidationErrorResponse = {
    type: string;
    title: string;
    status: number;
    errors: {
        [key: string]: string[]
    };
};

export const isApiErrorResponse = (response: any): response is ApiErrorResponse =>
    typeof response === 'object' && response !== null &&
    response.hasOwnProperty('type') && typeof response.title === 'string' &&
    response.hasOwnProperty('title') && typeof response.title === 'string';

export const isValidationError = (response: any): response is ApiValidationErrorResponse =>
    response.hasOwnProperty('type') && typeof response.title === 'string' &&
    response.hasOwnProperty('errors') && typeof response.errors === 'object' &&
    Object.keys(response.errors).length > 0;