export enum ProcessingState {
  OPEN = 'open',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum Language {
  DE = 'de',
  EN = 'en',
}

export type IdPathParam = {
  id: string;
};

export type RegistrationMetaRequest = {
  processingState: ProcessingState;
  limit: number;
  offset: number;
};

export type RegistrationMeta = {
  id: string;
  state: ProcessingState;
  dateCreated: string;
};

export type RegistrationMetaResponse = {
  data: Array<RegistrationMeta>;
  totalResults: number;
};

type Insurer = {
  fophId: number;
  name: string;
};

type InsuranceConfiguration = {
  insurer: Insurer;
  deductible: number;
  accidentCoverage: boolean;
  rateId: string;
  rateName: string;
  familyDoctor: string;
  familyDoctorZsrNo: string;
};

type InsuranceDocuments = {
  id: string;
  type: string;
};

type BasePerson = {
  partnerId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  language: Language;
};

type Partner = BasePerson & {
  nationality: string;
  residencePermit: string;
  birthDate: string;
  insuranceConfiguration: InsuranceConfiguration;
  previousInsurer: Insurer;
  contractBeginDate: string;
  documents: Array<InsuranceDocuments>;
};

type ContactPerson = BasePerson & {
  email: string;
  mobile: string;
  phone: string;
};

type Address = {
  street: string;
  streetNo: string;
  zip: string;
  city: string;
  bfsNo: string;
  canton: string;
};

type PaymentInfo = {
  interval: string;
  type: string;
  iban: string;
};

type Family = {
  partner: Array<Partner>;
  address: Address;
  contactPerson: ContactPerson;
  paymentInfo: PaymentInfo;
};

export type Registration = RegistrationMeta & {
  family: Family;
  reason?: string;
};
