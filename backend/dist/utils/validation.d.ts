import Joi from 'joi';
export declare const validationSchemas: {
    createBooking: Joi.ObjectSchema<any>;
    updateBookingStatus: Joi.ObjectSchema<any>;
    updatePaymentStatus: Joi.ObjectSchema<any>;
    createService: Joi.ObjectSchema<any>;
    createCustomer: Joi.ObjectSchema<any>;
    calculatePrice: Joi.ObjectSchema<any>;
    pagination: Joi.ObjectSchema<any>;
    dateRange: Joi.ObjectSchema<any>;
    searchQuery: Joi.ObjectSchema<any>;
    email: Joi.StringSchema<string>;
    phoneSA: Joi.StringSchema<string>;
    password: Joi.StringSchema<string>;
    url: Joi.StringSchema<string>;
    uuid: Joi.StringSchema<string>;
    referenceNumber: Joi.StringSchema<string>;
};
/**
 * Validate data against a schema
 */
export declare function validate<T>(data: any, schema: Joi.Schema): {
    valid: boolean;
    data?: T;
    errors?: string[];
};
/**
 * Sanitize and validate input
 */
export declare function sanitizeAndValidate<T>(input: any, schema: Joi.Schema): T;
/**
 * Custom validators
 */
export declare const customValidators: {
    isValidSAId(id: string): boolean;
    isValidCreditCard(cardNumber: string): boolean;
    isValidExpiryDate(expiry: string): boolean;
    isValidCVV(cvv: string, cardType?: string): boolean;
    isValidVehicleRegistration(reg: string): boolean;
    isValidVIN(vin: string): boolean;
};
declare const _default: {
    validationSchemas: {
        createBooking: Joi.ObjectSchema<any>;
        updateBookingStatus: Joi.ObjectSchema<any>;
        updatePaymentStatus: Joi.ObjectSchema<any>;
        createService: Joi.ObjectSchema<any>;
        createCustomer: Joi.ObjectSchema<any>;
        calculatePrice: Joi.ObjectSchema<any>;
        pagination: Joi.ObjectSchema<any>;
        dateRange: Joi.ObjectSchema<any>;
        searchQuery: Joi.ObjectSchema<any>;
        email: Joi.StringSchema<string>;
        phoneSA: Joi.StringSchema<string>;
        password: Joi.StringSchema<string>;
        url: Joi.StringSchema<string>;
        uuid: Joi.StringSchema<string>;
        referenceNumber: Joi.StringSchema<string>;
    };
    validate: typeof validate;
    sanitizeAndValidate: typeof sanitizeAndValidate;
    customValidators: {
        isValidSAId(id: string): boolean;
        isValidCreditCard(cardNumber: string): boolean;
        isValidExpiryDate(expiry: string): boolean;
        isValidCVV(cvv: string, cardType?: string): boolean;
        isValidVehicleRegistration(reg: string): boolean;
        isValidVIN(vin: string): boolean;
    };
};
export default _default;
//# sourceMappingURL=validation.d.ts.map