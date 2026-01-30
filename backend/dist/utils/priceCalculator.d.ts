export interface PriceCalculationInput {
    serviceType: string;
    vehicleType: string;
    extras: string[];
    condition: string;
}
export declare function calculatePrice(input: PriceCalculationInput): Promise<number>;
//# sourceMappingURL=priceCalculator.d.ts.map