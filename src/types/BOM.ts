export interface BOMCreate{
  bomName: string;
  details: {
    stockName: string;
    manufactureNOS: string;
    manuStockName: string;
    gDownId: number;
    typeOfItems: string;
    quantity: number;
    unitId: number;
    rate: number;
    rowOrderId: number;
  }[];
}

