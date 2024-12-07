
export interface ICustomerCreation
{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    sector: string;
    street: string;
    googlePin: string;
    homePicture: string;
    organization: string;
    contract: string;
}


export interface ICustomer
{
  
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        address: string;
        sector: string;
        street: string;
        googlePin: string;
        homePicture: string;
        status: string;
        organization: string; // Add this property
        organizationId?: number;
         contract: string;
      
}