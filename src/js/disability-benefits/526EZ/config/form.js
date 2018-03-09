import _ from '../../../common/utils/data-utils';

// import fullSchema526EZ from 'vets-json-schema/dist/21-526EZ-schema.json';


import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  transform,
  supportingEvidenceOrientation,
  evidenceTypesDescription,
  evidenceTypeHelp,
  disabilityNameTitle,
  vaMedicalRecordsIntro,
  privateRecordsChoice,
  privateRecordsChoiceHelp
} from '../helpers';

const initialData = {
  // For testing purposes only
  disabilities: [
    {
      disability: { // Is this extra nesting necessary?
        diagnosticText: 'PTSD',
        decisionCode: 'Filler text', // Should this be a string?
        // Is this supposed to be an array?
        specialIssues: {
          specialIssueCode: 'Filler text',
          specialIssueName: 'Filler text'
        },
        ratedDisabilityId: '12345',
        disabilityActionType: 'Filler text',
        ratingDecisionId: '67890',
        diagnosticCode: 'Filler text',
        // Presumably, this should be an array...
        secondaryDisabilities: [
          {
            diagnosticText: 'First secondary disability',
            disabilityActionType: 'Filler text'
          },
          {
            diagnosticText: 'Second secondary disability',
            disabilityActionType: 'Filler text'
          }
        ]
      }
    },
    {
      disability: { // Is this extra nesting necessary?
        diagnosticText: 'Second Disability',
        decisionCode: 'Filler text', // Should this be a string?
        // Is this supposed to be an array?
        specialIssues: {
          specialIssueCode: 'Filler text',
          specialIssueName: 'Filler text'
        },
        ratedDisabilityId: '54321',
        disabilityActionType: 'Filler text',
        ratingDecisionId: '09876',
        diagnosticCode: 'Filler text',
        // Presumably, this should be an array...
        secondaryDisabilities: [
          {
            diagnosticText: 'First secondary disability',
            disabilityActionType: 'Filler text'
          },
          {
            diagnosticText: 'Second secondary disability',
            disabilityActionType: 'Filler text'
          }
        ]
      }
    }
  ]
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/21-526EZ',
  trackingPrefix: 'disability-526EZ-',
  formId: '21-526EZ',
  version: 1,
  migrations: [],
  savedFormMessages: {
    notFound: 'Please start over to apply for disability claims increase.',
    noAuth: 'Please sign in again to resume your application for disability claims increase.'
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  defaultDefinitions: {},
  title: 'Disability Claims for Increase',
  subTitle: 'Form 21-526EZ',
  // getHelp: GetFormHelp,
  chapters: {
    chapterOne: {
      title: 'Chapter One',
      pages: {
        pageOne: {
          title: 'Page One',
          path: 'chapter-one/page-one',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {}
          },
        }
      }
    },
    chapterTwo: {
      title: 'Chapter Two',
      pages: {
        pageOne: {
          title: 'Page One',
          path: 'chapter-two/page-one',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {}
          },
        }
      }
    },
    chapterThree: {
      title: 'Chapter Three',
      pages: {
        pageOne: {
          title: 'Page One',
          path: 'chapter-three/page-one',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {}
          },
        }
      }
    },
    supportingEvidence: {
      title: 'Supporting Evidence',
      pages: {
        orientation: {
          title: '',
          path: 'supporting-evidence/orientation',
          initialData,
          uiSchema: {
            'ui:description': supportingEvidenceOrientation
          },
          schema: {
            type: 'object',
            properties: {}
          }
        },
        evidenceType: {
          title: (formData, { pagePerItemIndex }) => _.get(`disabilities.${pagePerItemIndex}.diagnosticText`, formData),
          path: 'supporting-evidence/:index/evidence-type',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': evidenceTypesDescription,
                'view:vaMedicalRecords': {
                  'ui:title': 'VA medical records'
                },
                'view:privateMedicalRecords': {
                  'ui:title': 'Private medical records'
                },
                'view:otherEvidence': {
                  'ui:title': 'Lay statements or other evidence'
                },
                'view:evidenceTypeHelp': {
                  'ui:description': evidenceTypeHelp
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    'view:vaMedicalRecords': {
                      type: 'boolean'
                    },
                    'view:privateMedicalRecords': {
                      type: 'boolean'
                    },
                    'view:otherEvidence': {
                      type: 'boolean'
                    },
                    'view:evidenceTypeHelp': {
                      type: 'object',
                      properties: {}
                    }
                  }
                }
              }
            }
          }
        },
        vaMedicalRecordsIntro: {
          title: '',
          path: 'supporting-evidence/:index/va-medical-records',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(`disabilities.${index}.view:vaMedicalRecords`, formData),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': vaMedicalRecordsIntro,
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {}
                }
              }
            }
          }
        },
        // pageFour: {},
        // pageFive: {},
        privateRecordChoice: {
          title: '',
          path: 'supporting-evidence/:index/private-medical-records-choice',
          showPagePerItem: true,
          arrayPath: 'disabilities',
          depends: (formData, index) => _.get(`disabilities.${index}.view:privateMedicalRecords`, formData),
          uiSchema: {
            disabilities: {
              items: {
                'ui:title': disabilityNameTitle,
                'ui:description': privateRecordsChoice,
                'view:uploadPrivateRecords': {
                  'ui:title': 'Do you want to upload your private medical records?',
                  'ui:widget': 'radio',
                  'ui:options': {
                    labels: {
                      yes: 'Yes',
                      no: 'No, please get them from my doctor'
                    }
                  }
                },
                'view:privateRecordsChoiceHelp': {
                  'ui:description': privateRecordsChoiceHelp
                }
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              disabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    'view:uploadPrivateRecords': {
                      type: 'string',
                      'enum': ['yes', 'no']
                    },
                    'view:privateRecordsChoiceHelp': {
                      type: 'object',
                      properties: {}
                    }
                  }
                }
              }
            }
          }
        },
        // pageSeven: {},
        // pageEight: {},
        // pageNine: {},
        // pageTen: {},
      }
    },
    chapterFive: {
      title: 'Chapter Five',
      pages: {
        pageOne: {
          title: 'Page One',
          path: 'chapter-five/page-one',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {}
          },
        }
      }
    }
  }
};


export default formConfig;
