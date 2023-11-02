import { AdminType } from '@interfaces';
import { AdminSchema, ClientSchema, SellerSchema } from '@models';

const dataCountryToExtract = {
  path: 'countryId',
  select: 'name -_id'
};

const dataCityToExtract = {
  path: 'cityId',
  select: 'name -_id'
};

export async function getAdminUser(email: string): Promise<AdminType | null> {
  return await AdminSchema.findOne({ email })
    .populate(dataCountryToExtract)
    .populate(dataCityToExtract);
}

export async function getClientUser(email: string): Promise<AdminType | null> {
  return await ClientSchema.findOne({ email })
    .populate(dataCountryToExtract)
    .populate(dataCityToExtract);
}

export async function getSellerUser(email: string): Promise<AdminType | null> {
  return await SellerSchema.findOne({ email })
    .populate(dataCountryToExtract)
    .populate(dataCityToExtract);
}
