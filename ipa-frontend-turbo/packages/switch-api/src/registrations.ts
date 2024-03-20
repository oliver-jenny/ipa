const REGISTRATIONS_URL = 'http://localhost:9000/registrations';

export enum ProcessingState {
  ALL = 'all',
  OPEN = 'open',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

enum Language {
  DE = 'de',
  EN = 'en',
}

type RegistrationMeta = {
  id: string;
  state: ProcessingState;
  dateCreated: string;
};

type RegistrationMetaResponse = {
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

const TIMEOUT = 10000;  // Timeout after 10 seconds
const CONTROLLER = new AbortController();
const REASON = new DOMException('signal timed out', 'TimeoutError');

export const getRegistrations = async (
  processingState: ProcessingState,
  offset: number,
  limit: number,
) => {
  const timeoutId = setTimeout(() => {
    CONTROLLER.abort(REASON);
  }, TIMEOUT);

  try {
    let finalProcessingState: ProcessingState | undefined = processingState;
    if (processingState === ProcessingState.ALL)
      finalProcessingState = undefined;

    const registrationMetasResponse = await fetch(`${REGISTRATIONS_URL}/`, {
      method: 'post',
      credentials: 'include',
      signal: CONTROLLER.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        processingState: finalProcessingState,
        offset,
        limit,
      }),
    });

    if (registrationMetasResponse.ok) {
      const registrationMetas =
        (await registrationMetasResponse.json()) as RegistrationMetaResponse;

      const registrations: Array<Registration> = [];
      for (const meta of registrationMetas.data) {
        const registrationResponse = await fetch(
          `${REGISTRATIONS_URL}/${meta.id}`,
          {
            method: 'get',
            credentials: 'include',
            signal: CONTROLLER.signal,
          },
        );

        if (registrationResponse.ok) {
          const registration = await registrationResponse.json();
          if (registration?.id) {
            registrations.push(registration);
          }
        }
      }

      console.log('clear timeout');

      clearTimeout(timeoutId);

      return {
        ok: registrationMetasResponse.ok,
        registrations,
        count: registrationMetas.totalResults,
      };
    }
  } catch (error) {
    console.error('An error occurred while fetching data: ', error);
    return { ok: false, registrations: [], count: 0 };
  }
};

export const acceptRegistration = async (id: string) => {
  const timeoutId = setTimeout(() => CONTROLLER.abort(REASON), TIMEOUT);

  try {
    const response = await fetch(`${REGISTRATIONS_URL}/${id}/accept`, {
      method: 'put',
      credentials: 'include',
      signal: CONTROLLER.signal,
    });

    clearTimeout(timeoutId);

    return response.ok;
  } catch (error) {
    console.log('An error occurred while accepting registration: ', error);
    return false;
  }
};

export const rejectRegistration = async (id: string, reason: string) => {
  const timeoutId = setTimeout(() => CONTROLLER.abort(REASON), TIMEOUT);

  try {
    const response = await fetch(`${REGISTRATIONS_URL}/${id}/reject`, {
      method: 'put',
      credentials: 'include',
      signal: CONTROLLER.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason,
      }),
    });

    clearTimeout(timeoutId);

    return response.ok;
  } catch (error) {
    console.log('An error occurred while accepting registration: ', error);
    return false;
  }
};
