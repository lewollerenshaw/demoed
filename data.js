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
        dateCreated: '12/07/2020',
      },
    ],
    dateCreated: '12/07/2020',
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
        dateCreated: '12/07/2020',
      },
      {
        title: 'Take 2',
        duration: '0:40',
        tags: ['Synth'],
        URI: 'URI',
        dateCreated: '12/07/2020',
      },
    ],
    dateCreated: '12/07/2020',
  },
];

module.exports = {
  SampleData,
};
