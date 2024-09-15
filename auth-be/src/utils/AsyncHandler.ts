import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandlerFunction<T> = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<T> | T;

const asyncHandler = <T>(
    requestHandler: AsyncHandlerFunction<T>
): RequestHandler => {
    return (req, res, next) => {
        const result = requestHandler(req, res, next);

        // Check if the result is a Promise, if not, wrap it in Promise.resolve
        const promiseResult =
            result instanceof Promise ? result : Promise.resolve(result);

        promiseResult.catch((err) => next(err));
    };
};

export { asyncHandler };
