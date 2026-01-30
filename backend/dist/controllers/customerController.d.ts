import { Request, Response } from 'express';
export declare const customerController: {
    getAllCustomers(req: Request, res: Response): Promise<void>;
    getCustomerById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCustomerByEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateCustomer(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCustomerStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    searchCustomers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=customerController.d.ts.map