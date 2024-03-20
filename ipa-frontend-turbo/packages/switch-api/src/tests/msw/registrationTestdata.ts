export const registrationMock = {
  _id: {
    $oid: '65f3f69268f719b450e98bd7',
  },
  id: '70645fec-03ed-4af8-b481-135790246',
  dateCreated: '2024-03-11T14:15:02.121Z',
  state: 'open',
  family: {
    address: {
      street: 'Mondweg',
      streetNo: '3',
      zip: '4055',
      city: 'Himmeldorf',
      bfsNo: '456',
      canton: 'BL',
    },
    contactPerson: {
      partnerId: '246801',
      firstName: 'Alex',
      lastName: 'Moon',
      gender: 'male',
      language: 'en',
      email: 'a.moon@example.com',
      mobile: '+41761234567',
      phone: '+41552223344',
    },
    partner: [
      {
        partnerId: '246801',
        firstName: 'Nora',
        lastName: 'Moon',
        birthDate: '1986-08-19',
        gender: 'female',
        language: 'en',
        nationality: 'CH',
        residencePermit: 'B',
        insuranceConfiguration: {
          insurer: {
            fophId: 399,
            name: 'AXA',
          },
          deductible: 200,
          accidentCoverage: true,
          rateId: 'MoonSecure',
          rateName: 'Moon Secure',
          familyDoctor: 'Dr. Stella Stern, Sternenweg 8, 4055 Himmeldorf',
          familyDoctorZsrNo: 'G551002',
        },
        previousInsurer: {
          fophId: 400,
          name: 'Lunar Insurance',
        },
        contractBeginDate: '2023-04-29',
        documents: [
          {
            id: 't6u7v8w9-x0y1z-2a3b4c5d6e7',
            type: 'policy',
          },
        ],
      },
    ],
    paymentInfo: {
      interval: 'yearly',
      type: 'creditCard',
      iban: null,
    },
  },
  reason: 'Found a more suitable insurance elsewhere.',
};
