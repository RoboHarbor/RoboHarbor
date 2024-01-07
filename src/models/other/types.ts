export type PricingPlan = {
    id: number;
    name: string;
    price: number;
    duration: string;
    features: Array<string>;
    isPopular: boolean;
};

type InvoiceItem = {
    id: number;
    name: string;
    description: string;
    quantity: number;
    unit_cost: string;
    total: string;
};

type Address = {
    owner: string;
    line_1: string;
    city: string;
    state: string;
    zip: number;
    phone: string;
};

export type Invoice = {
    invoice_id?: string;
    customer?: string;
    notes?: string;
    order_date?: string;
    order_status?: string;
    order_id: string;
    address: Address;
    items: InvoiceItem[];
    sub_total?: number;
    discount?: number;
    vat?: number;
    total?: number;
};
