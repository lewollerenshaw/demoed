// eslint-disable-next-line no-unused-vars
const store = {
  demos: [
    {
      id: null,
      title: null,
      recordings: [
        {
          title: null,
          duration: null,
          tags: [],
          URI: null,
          dateCreated: null,
        },
      ],
      dateCreated: null,
    },
  ],
  deletedDemos: [
    {
      dateDeleted: null,
      demo: {},
    },
  ],
  deletedRecordings: [
    {
      dateDeleted: null,
      associatedDemo: null,
      recording: {
        title: null,
        duration: null,
        tags: [],
        URI: null,
        dateCreated: null,
      },
    },
  ],
  darkMode: false,
};

const SampleData = [
  {
    id: 'ID',
    title: 'Easy Living',
    recordings: [
      {
        title: 'Take 1',
        duration: '0:40',
        tags: ['Guitar', 'Bass'],
        URI: 'URI',
        dateCreated: new Date(2013, 3, 25, 10, 33, 30),
      },
    ],
    dateCreated: new Date(2012, 3, 25, 10, 33, 30),
  },
  {
    id: 'ID2',
    title: 'Moon',
    recordings: [
      {
        title: 'Take 1',
        duration: '0:40',
        tags: ['Guitar', 'Synth', 'Vocals'],
        URI: 'URI',
        dateCreated: new Date(2014, 3, 25, 10, 33, 30),
      },
      {
        title: 'Take 2',
        duration: '0:40',
        tags: ['Synth'],
        URI: 'URI',
        dateCreated: new Date(2015, 3, 25, 10, 33, 30),
      },
    ],
    dateCreated: new Date(2014, 3, 25, 10, 33, 30),
  },
  {
    id: 'ID3',
    title: 'Sunset In The Valley',
    recordings: [
      {
        title: 'Take 1',
        duration: '0:40',
        tags: ['Guitar', 'Synth', 'Vocals'],
        URI: 'URI',
        dateCreated: new Date(2020, 3, 25, 10, 33, 30),
      },
      {
        title: 'Take 2',
        duration: '0:40',
        tags: ['Synth'],
        URI: 'URI',
        dateCreated: new Date(2020, 1, 25, 10, 33, 30),
      },
      {
        title: 'Take 3',
        duration: '0:40',
        tags: ['Guitar', 'Synth', 'Vocals'],
        URI: 'URI',
        dateCreated: new Date(2020, 7, 25, 10, 33, 30),
      },
      {
        title: 'Take 4',
        duration: '0:40',
        tags: ['Synth'],
        URI: 'URI',
        dateCreated: new Date(2004, 3, 25, 10, 33, 30),
      },
    ],
    dateCreated: new Date(2018, 11, 24, 10, 33, 30),
  },
];

module.exports = {
  SampleData,
};
