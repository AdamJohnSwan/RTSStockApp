import { isApiErrorResponse, isValidationError } from '../api/ValidationError';

export async function getApiError(response: Response) {
    const text = await response.text();
    if (!text) {
        return new Error("Unknown server error");
    }
    try {
        const json = JSON.parse(text);
        if (isValidationError(json)) {
            const firstErrorKey = Object.keys(json.errors)[0];
            return new Error(json.errors[firstErrorKey].join());
        } else if (isApiErrorResponse(json)) {
            return new Error(json.title);
        }
        return new Error(JSON.stringify(json));
    } catch {
        return new Error(text);
    }
}