const ConfigModel = require('../models/config');
const RuleModel = require('../models/rule');
const TrimesterModel = require('../models/trimesters');
const BlackListModel = require('../models/blackList');
const TeacherModel = require('../models/teacher');
const SubjectModel = require('../models/subject');
const queries = require('./queries');
const settings = require('../settings');

const Subjects = [
  {
    name: 'BIOLOGIA GENERAL',
    code: 'CBB101',
    type: 'T',
    section: '01',
    room: 'FD415',
    teacherAssigned: 'KELVIN ANTONIO GUERRERO RAMIREZ'
  },
  {
    name: 'PROGRAMACION I',
    code: 'INS212',
    type: 'T',
    section: '01',
    room: 'FD414',
    teacherAssigned: 'JOEL FRANCIS JIMENEZ BAEZ'
  },
  {
    name: 'FUNDAMENTOS DE PROGRAMACION',
    code: 'INS208',
    type: 'T',
    section: '01',
    room: 'FD405',
    teacherAssigned: 'FERNANDO ARTURO HIRUJO PICHARDO'
  },
  {
    name: 'HOJAS DE CALCULO PARA INGENIEROS',
    code: 'INS209',
    type: 'T',
    section: '01',
    room: 'FD402',
    teacherAssigned: 'CRISTIAN MARIANO RODRIGUEZ REYES'
  },
  {
    name: 'DIBUJO CIVIL',
    code: 'CIV311',
    type: 'T',
    section: '03',
    room: 'FD411',
    teacherAssigned: 'OMAR RAMOS PEPEN'
  },
  {
    name: 'DIBUJO MECANICO I',
    code: 'INM201',
    type: 'T',
    section: '02',
    room: 'FD412',
    teacherAssigned: 'PEDRO PABLO BENITEZ LUNA'
  },
];

const AppConfigs = [
  {
    key: settings.CONFIGS.isFullscreen,
    value: true
  },
  {
    key: settings.CONFIGS.showSurvey,
    value: true
  },
  {
    key: settings.CONFIGS.studentUrl,
    value: 'https://www.digitalocean.com/community/tutorials/understanding-date-and-time-in-javascript'
  },
  {
    key: settings.CONFIGS.teacherUrl,
    value: 'https://stackoverflow.com/questions/40332455/mongoose-query-by-date/40332542'
  }
];

const rules = [
  {
    number: 1,
    text: 'Text for rule #1 here....'
  },
  {
    number: 2,
    text: 'Text for rule #2 here....'
  },
  {
    number: 3,
    text: 'Text for rule #3 here....'
  },
  {
    number: 4,
    text: 'Text for rule #4 here....'
  },
  {
    number: 5,
    text: 'Text for rule #5 here....'
  },
  {
    number: 6,
    text: 'Text for rule #6 here....'
  },
  {
    number: 7,
    text: 'Text for rule #7 here....'
  },
  {
    number: 8,
    text: 'Text for rule #8 here....'
  },
  {
    number: 9,
    text: 'Text for rule #9 here....'
  },
  {
    number: 10,
    text: 'Text for rule #10 here....'
  },
];

const trimesters = [
  {
    start: new Date(2019, 5, 1),
    ends: new Date(2019, 7, 12),
    name: 'Mayo - Julio 2019',
    lastModified: undefined,
    customId: 'M-J-2019'
  },
  {
    start: new Date(2019, 8, 1),
    ends: new Date(2019, 10, 24),
    name: 'Agosto - Octubre 2019',
    lastModified: undefined,
    customId: 'A-O-2019'
  },
  {
    start: new Date(2019, 11, 1),
    ends: new Date(2020, 1, 18),
    name: 'Noviembre - Enero 2020',
    lastModified: undefined,
    customId: 'N-E-2020'
  },
];

const blackListedUsers = [
  {
    intecId: '1066359',
    domain: 'intec'
  }
];

queries.getConfigs().then(docs => {
  if (docs.length === 0) {
    ConfigModel.create(AppConfigs, (err, result) => {
      if (!!err) return;
      console.log('Application configurations seeded. ', result);
    });
  }
});

queries.getRules().then(docs => {
  if (docs.length === 0) {
    RuleModel.create(rules, (err, result) => {
      if (!!err) return;
      console.log('Rules seeded. ', result);
    })
  }
});

queries.getTrimesters().then(docs => {
  if (docs.length === 0) {
    TrimesterModel.create(trimesters, (err, result) => {
      if (!!err) {
        console.log(err);
        return;
      };
      console.log('Trimesters seeded. ', result);
    })
  }
});

queries.getBlackListUsers().then(docs => {
  if (docs.length === 0) {
    BlackListModel.create(blackListedUsers, (err, result) => {
      if (!!err) {
        console.log(err);
        return;
      };
      console.log('Blacklist seeded. ', result);
    })
  }
});

queries.getSubjects().then(docs => {
  if (docs.length === 0) {
    SubjectModel.create(Subjects, (err, result) => {
      if (!!err) {
        console.log(err);
        return;
      };
      console.log('Subjects seeded. ', result);
    })
  }
});
