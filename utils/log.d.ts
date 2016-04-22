import Promise = require('any-promise');
export interface PrintOptions {
    verbose: boolean;
}
export declare function log(message: string): void;
export declare function logInfo(message: string, prefix?: string): void;
export declare function logWarning(message: string, prefix?: string): void;
export declare function logError(message: string, prefix?: string): void;
export declare function handle(promise: any, options: PrintOptions): Promise<any>;
export declare function handleError(error: Error, options: PrintOptions): any;
