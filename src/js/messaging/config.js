module.exports = {
  // Basic pieces of data for making API requests.
  api: {
    url: '/api/v0/messaging/health',
    settings: {
      get: {
        method: 'GET',
        headers: {
          'X-Key-Inflection': 'camel'
        }
      },
      post: {
        method: 'POST',
        headers: {
          'X-Key-Inflection': 'camel',
          'Content-Type': 'application/json'
        }
      }
    }
  },

  paths: {
    INBOX_URL: '/messaging',
    COMPOSE_URL: '/messaging/compose',
    DRAFTS_URL: '/messaging/folder/-2'
  },

  // An array of objects containing the category name (label) and a
  // value for use with select, radio button inputs.
  messageCategories: [
    {
      label: 'Appointments',
      value: 'APPOINTMENTS'
    },
    {
      label: 'Education',
      value: 'EDUCATION'
    },
    {
      label: 'Medications',
      value: 'MEDICATIONS'
    },
    {
      label: 'Test results',
      value: 'TEST_RESULTS'
    },
    {
      label: 'Other (please add a subject)',
      value: 'OTHER'
    }
  ],

  composeMessagePlaceholders: {
    subject: 'Add an additional subject line',
    message: 'Type your message here'
  },

  composeMessageErrors: {
    category: 'Please select a category.',
    message: 'Please enter your message.',
    subject: 'Please add subject description.',
    recipient: 'Please select a recipient from your health care team.'
  },

  composeMessageMaxChars: 2000,
  allowedMimeTypes: [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/excel',
    'application/vnd.ms-excel',
    'image/gif',
    'image/jpg',
    'application/rtf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png'
  ],
  createNewFolder: {
    maxLength: 50,
    errorMessages: {
      empty: 'Please enter a folder name.',
      exists: 'You already have a folder with that name. Try again?',
      patternMismatch: 'Only the letters A through Z, numbers, and spaces are allowed in folder names.'
    }
  }
};
