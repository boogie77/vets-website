export default {
  // For testing purposes only
  prefilled: true,
  fullName: {
    first: 'Sally',
    last: 'Alphonse'
  },
  socialSecurityNumber: '234234234',
  vaFileNumber: '345345345',
  gender: 'F',
  dateOfBirth: '1990-04-02',
  directDeposit: {
    accountType: 'CHECKING',
    accountNumber: '234234234',
    routingNumber: '234234234',
    bankName: 'Local bank'
  },
  veteran: {
    primaryPhone: '2342342342',
    secondaryPhone: '3242342342',
    emailAddress: 'test@test.com',
    mailingAddress: {
      type: 'DOMESTIC',
      country: 'USA',
      city: 'Detroit',
      state: 'MI',
      zipCode: '234563453',
      addressLine1: '234 Maple St.'
    }
  },
  servicePeriods: [
    {
      serviceBranch: 'Army',
      dateRange: {
        from: '1990-02-02',
        to: '2010-03-04'
      }
    }
  ],
  disabilities: [
    {
      // Temporarily using a number to get past the rated disabilities page until the new schema comes in
      diagnosticCode: 123,
      name: 'Post-Traumatic Stress Disorder. This could also be claimed as Insomnia.',
      ratingPercentage: 30,
      // Is this supposed to be an array?
      specialIssues: [
        {
          specialIssueCode: 'Filler text',
          specialIssueName: 'Filler text'
        }
      ],
      ratedDisabilityId: '12345',
      disabilityActionType: 'INCREASE',
      ratingDecisionId: '67890',
      classificationCode: 'Filler Code',
      secondaryDisabilities: [
        {
          name: 'First secondary disability',
          disabilityActionType: 'INCREASE'
        },
        {
          name: 'Second secondary disability',
          disabilityActionType: 'INCREASE'
        }
      ]
    },
    {
      diagnosticCode: 1234,
      name: 'Intervertebral Disc Degeneration and Osteoarthritisstatus post-anterior disc fusion L4-S1 and L5-S1 microdiscectomy. Also claimed as muscle spasms back, herniated disc L4-L5, L5-S1.',
      ratingPercentage: 20,
      // Is this supposed to be an array?
      specialIssues: [
        {
          specialIssueCode: 'Filler text',
          specialIssueName: 'Filler text'
        }
      ],
      ratedDisabilityId: '54321',
      disabilityActionType: 'INCREASE',
      ratingDecisionId: '09876',
      classificationCode: 'Filler Code',
      secondaryDisabilities: [
        {
          name: 'First secondary disability',
          disabilityActionType: 'INCREASE'
        },
        {
          name: 'Second secondary disability',
          disabilityActionType: 'INCREASE'
        }
      ]
    }
  ],
  selectedDisabilities: [
    {
      name: 'PTSD',
      // Is this supposed to be an array?
      specialIssues: {
        specialIssueCode: 'Filler text',
        specialIssueName: 'Filler text'
      },
      ratedDisabilityId: '12345',
      disabilityActionType: 'INCREASE',
      ratingDecisionId: '67890',
      diagnosticCode: 12345,
      classificationCode: 'Filler Code',
      // Presumably, this should be an array...
      secondaryDisabilities: [
        {
          name: 'First secondary disability',
          disabilityActionType: 'INCREASE'
        },
        {
          name: 'Second secondary disability',
          disabilityActionType: 'INCREASE'
        }
      ]
    },
    {
      name: 'Second Disability',
      // Is this supposed to be an array?
      specialIssues: {
        specialIssueCode: 'Filler text',
        specialIssueName: 'Filler text'
      },
      ratedDisabilityId: '54321',
      disabilityActionType: 'INCREASE',
      ratingDecisionId: '09876',
      diagnosticCode: 123456,
      classificationCode: 'Filler Code',
      // Presumably, this should be an array...
      secondaryDisabilities: [
        {
          name: 'First secondary disability',
          disabilityActionType: 'INCREASE'
        },
        {
          name: 'Second secondary disability',
          disabilityActionType: 'INCREASE'
        }
      ]
    }
  ]
};
