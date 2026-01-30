import { Request, Response } from 'express';
export declare const serviceController: {
    getAllServices(req: Request, res: Response): Promise<void>;
    getServiceById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createService(req: Request, res: Response): Promise<void>;
    updateService(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteService(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    calculatePrice(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=serviceController.d.ts.map