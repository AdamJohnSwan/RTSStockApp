import { isApiErrorResponse, isValidationError } from '../api/ValidationError';

export async function getApiError(response: Response) {
    const text = await response.text();
    if (!text) {
        return new Error("Unknown server error");
    }
    try {
        const json = JSON.parse(text);
        if (isValidationError(json)) {
            let errors: string[] = []
            for (const key in json.errors) {
                errors = errors.concat(json.errors[key])
            }
            return new Error(errors.join());
        } else if (isApiErrorResponse(json)) {
            return new Error(json.title);
        }
        return new Error(JSON.stringify(json));
    } catch (e) {
        return new Error(text);
    }
}