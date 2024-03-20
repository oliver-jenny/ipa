import { UUID } from 'mongodb';
import type {
  Registration,
  RegistrationMeta,
} from '../../api/registrations/types';
import {
  Gender,
  Language,
  ProcessingState,
} from '../../api/registrations/types';

const generateUUID = () => new UUID().toString();

const getCurrentDateISOString = () => new Date().toISOString();

const uuid1 = generateUUID();
const uuid2 = generateUUID();
const uuid3 = generateUUID();

export const registrationMetaOpen: RegistrationMeta = {
  id: uuid1,
  dateCreated: getCurrentDateISOString(),
  state: ProcessingState.OPEN,
};

export const registrationMetaAccepted: RegistrationMeta = {
  id: uuid2,
  dateCreated: getCurrentDateISOString(),
  state: ProcessingState.ACCEPTED,
};

export const registrationMetaRejected: RegistrationMeta = {
  id: uuid3,
  dateCreated: getCurrentDateISOString(),
  state: ProcessingState.REJECTED,
};

const {
  id: id1,
  dateCreated: dateCreated1,
  state: state1,
} = registrationMetaOpen;

const {
  id: id2,
  dateCreated: dateCreated2,
  state: state2,
} = registrationMetaAccepted;

const {
  id: id3,
  dateCreated: dateCreated3,
  state: state3,
} = registrationMetaRejected;

export const registrationOpen: Registration = {
  id: id1,
  dateCreated: dateCreated1,
  state: state1,
  family: {
    address: {
      street: 'General-Guisan-Strasse',
      streetNo: '40',
      zip: '8400',
      city: 'Winterthur',
      bfsNo: '230',
      canton: 'ZH',
    },
    contactPerson: {
      partnerId: '123456',
      firstName: 'Max',
      lastName: 'Mustermann',
      gender: Gender.MALE,
      language: Language.DE,
      email: 'mustermann@example.com',
      mobile: '+41798765432',
      phone: '+41521234567',
    },
    partner: [
      {
        partnerId: '123456',
        firstName: 'Max',
        lastName: 'Mustermann',
        birthDate: '1987-12-06',
        gender: Gender.MALE,
        language: Language.DE,
        nationality: 'CH',
        residencePermit: 'B',
        insuranceConfiguration: {
          insurer: {
            fophId: 376,
            name: 'Sanitas',
          },
          deductible: 0,
          accidentCoverage: true,
          rateId: 'KPTwinwin',
          rateName: 'KPTwin.win',
          familyDoctor:
            'Dorothée Luchsinger, Hegifeldstrasse 28a, 8404 Winterthur',
          familyDoctorZsrNo: 'G358301',
        },
        previousInsurer: {
          fophId: 376,
          name: 'KPT',
        },
        contractBeginDate: '2023-01-01',
        documents: [
          {
            id: 'deeb25a6-4366-45da-9915-a60690cb9093',
            type: 'mandate',
          },
        ],
      },
      {
        partnerId: '123456',
        firstName: 'Mina',
        lastName: 'Mustermann',
        birthDate: '1987-11-05',
        gender: Gender.FEMALE,
        language: Language.EN,
        nationality: 'CH',
        residencePermit: 'B',
        insuranceConfiguration: {
          insurer: {
            fophId: 372,
            name: 'Sanitas',
          },
          deductible: 0,
          accidentCoverage: true,
          rateId: 'HelveticaWinwin',
          rateName: 'Helvetica"in.win',
          familyDoctor:
            'Dorothée Luchsinger, Hegifeldstrasse 28a, 8404 Winterthur',
          familyDoctorZsrNo: 'G358301',
        },
        previousInsurer: {
          fophId: 376,
          name: 'KPT',
        },
        contractBeginDate: '2023-01-01',
        documents: [
          {
            id: 'deeb25a6-4366-45da-9915-a60690cb9093',
            type: 'mandate',
          },
        ],
      },
    ],
    paymentInfo: {
      interval: 'monthly',
      type: 'eBill',
      iban: 'CH9300762011623852957',
    },
  },
};

export const registrationAccepted: Registration = {
  id: uuid2,
  dateCreated: '2024-03-11T12:00:00.000Z',
  state: ProcessingState.ACCEPTED,
  family: {
    address: {
      street: 'Rainbow Avenue',
      streetNo: '7',
      zip: '12345',
      city: 'Sunnytown',
      bfsNo: '789',
      canton: 'RT',
    },
    contactPerson: {
      partnerId: 'partner_id_accepted',
      firstName: 'Aurora',
      lastName: 'Sunshine',
      gender: Gender.FEMALE,
      language: Language.EN,
      email: 'aurora.sunshine@example.com',
      mobile: '+1234567890',
      phone: '+987654321',
    },
    partner: [
      {
        partnerId: 'partner_id_accepted',
        firstName: 'Sky',
        lastName: 'Cloudwalker',
        birthDate: '1985-05-15T00:00:00.000Z',
        gender: Gender.MALE,
        language: Language.EN,
        nationality: 'US',
        residencePermit: 'B',
        insuranceConfiguration: {
          insurer: {
            fophId: 420,
            name: 'DreamGuard',
          },
          deductible: 250,
          accidentCoverage: true,
          rateId: 'DreamyCoverage',
          rateName: 'Dreamy Coverage Plan',
          familyDoctor: 'Dr. Luna Moonbeam, Celestial Clinic, Cloud Nine',
          familyDoctorZsrNo: 'ZZZ123456',
        },
        previousInsurer: {
          fophId: 999,
          name: 'NightmareInsurance',
        },
        contractBeginDate: '2023-01-01T00:00:00.000Z',
        documents: [
          {
            id: 'document_id_accepted',
            type: 'policy',
          },
        ],
      },
    ],
    paymentInfo: {
      interval: 'quarterly',
      type: 'creditCard',
      iban: 'CH12893713796182376',
    },
  },
};

export const registrationRejected: Registration = {
  id: uuid3,
  dateCreated: '2024-03-11T12:00:00.000Z',
  state: ProcessingState.REJECTED,
  family: {
    address: {
      street: 'Mystic Lane',
      streetNo: '13',
      zip: '54321',
      city: 'Moonville',
      bfsNo: '321',
      canton: 'MT',
    },
    contactPerson: {
      partnerId: 'partner_id_rejected',
      firstName: 'Luna',
      lastName: 'Nightshade',
      gender: Gender.FEMALE,
      language: Language.DE,
      email: 'luna.nightshade@example.com',
      mobile: '+9876543210',
      phone: '+123456789',
    },
    partner: [
      {
        partnerId: 'partner_id_rejected',
        firstName: 'Midnight',
        lastName: 'Shadow',
        birthDate: '1980-10-31T00:00:00.000Z',
        gender: Gender.MALE,
        language: Language.EN,
        nationality: 'UK',
        residencePermit: 'B',
        insuranceConfiguration: {
          insurer: {
            fophId: 666,
            name: 'DarknessGuard',
          },
          deductible: 500,
          accidentCoverage: false,
          rateId: 'NightmarePlan',
          rateName: 'Nightmare Coverage Plan',
          familyDoctor: 'Dr. Raven Black, Shadow Health Center, Nightfall',
          familyDoctorZsrNo: 'YYY654321',
        },
        previousInsurer: {
          fophId: 111,
          name: 'SunshineInsurance',
        },
        contractBeginDate: '2023-01-01T00:00:00.000Z',
        documents: [
          {
            id: 'document_id_rejected',
            type: 'application',
          },
        ],
      },
    ],
    paymentInfo: {
      interval: 'yearly',
      type: 'bankTransfer',
      iban: 'XX1234567890123456789',
    },
  },
};
