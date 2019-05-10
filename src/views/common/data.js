const sleepData = [
  {label: '非常好', value: 0},
  {label: '好', value: 1},
  {label: '一般', value: 2},
  {label: '差', value: 3},
  {label: '很差', value: 4}
];
const eatData = [
  {label: '正常', value: 0},
  {label: '过量', value: 1},
  {label: '过甜', value: 2},
  {label: '过咸', value: 3}
];
const moodData = [
  {label: '正常', value: 0},
  {label: '愉快', value: 1},
  {label: '伤心', value: 2},
  {label: '抑郁', value: 3},
  {label: '紧张', value: 4},
  {label: '焦虑', value: 5}
];
const symptomsData = [
  {
    label: '正常',
    value: 0,
    isLeaf: true,
  },
  {
    label: '头部',
    value: '1',
    children: [
      {
        label: '头痛',
        value: '1',
      },
      {
        label: '头晕',
        value: '2',
      },
      {
        label: '其他',
        value: '0',
      }
    ],
  },
  {
    label: '胸部',
    value: '2',
    children: [
      {
        label: '胸闷',
        value: '1',
      },
      {
        label: '心悸',
        value: '2',
      },
      {
        label: '胸痛',
        value: '3',
      },
      {
        label: '其他',
        value: '0',
      }
    ],
  },
  {
    label: '呼吸',
    value: '3',
    children: [
      {
        label: '咳嗽',
        value: '1',
      },
      {
        label: '咳痰',
        value: '2',
      },
      {
        label: '呼吸困难',
        value: '3',
      },
      {
        label: '其他',
        value: '0',
      }
    ],
  },
  {
    label: '消化',
    value: '4',
    children: [
      {
        label: '多饮',
        value: '1',
      },
      {
        label: '多食',
        value: '2',
      },
      {
        label: '恶心呕吐',
        value: '3',
      },
      {
        label: '腹泻',
        value: '4',
      },
      {
        label: '便秘',
        value: '5',
      },
      {
        label: '其他',
        value: '0',
      }
    ],
  },
  {
    label: '四肢',
    value: '5',
    children: [
      {
        label: '关节肿痛',
        value: '1',
      },
      {
        label: '四肢麻木',
        value: '2',
      },
      {
        label: '其他',
        value: '0',
      }
    ],
  },
  {
    label: '五官',
    value: '6',
    children: [
      {
        label: '视力模糊',
        value: '1',
      },
      {
        label: '鼻衄',
        value: '2',
      },
      {
        label: '其他',
        value: '0',
      }
    ],
  },
  {
    label: '全身',
    value: '7',
    children: [
      {
        label: '乏力',
        value: '1',
      },
      {
        label: '皮疹',
        value: '2',
      },
      {
        label: '浮肿',
        value: '3',
      },
      {
        label: '发热',
        value: '4',
      },
      {
        label: '其他',
        value: '0',
      }
    ],
  },
  {
    label: '泌尿',
    value: '8',
    children: [
      {
        label: '尿痛',
        value: '1',
      },
      {
        label: '尿频',
        value: '2',
      },
      {
        label: '多尿',
        value: '3',
      },
      {
        label: '其他',
        value: '0',
      }
    ],
  },
];
const timesData = [
  {label: '1次', value: 1},
  {label: '2次', value: 2},
  {label: '3次', value: 3},
  {label: '4次', value: 4},
  {label: '5次', value: 5},
  {label: '其他', value: 0}
];
const dosageData = [
  [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },
    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
    {
      label: '6',
      value: '6',
    },
    {
      label: '7',
      value: '7',
    },
    {
      label: '8',
      value: '8',
    },
  ],
  [
    {
      label: '丸',
      value: '0',
    },
    {
      label: '片',
      value: '1',
    },
    {
      label: '袋',
      value: '2',
    },
    {
      label: '滴',
      value: '3',
    },
    {
      label: '瓶',
      value: '4',
    },
    {
      label: 'mg',
      value: '5',
    },
    {
      label: 'g',
      value: '6',
    },
    {
      label: 'ml',
      value: '7',
    },
  ],
];
const wayData = [
  {label: '口服', value: 1},
  {label: '含化', value: 2},
  {label: '舌下给药', value: 3},
  {label: '咀嚼', value: 4},
  {label: '吸入', value: 5},
  {label: '外用', value: 6},
  {label: '其他', value: 0}
];


export default {
  sleepData,
  eatData,
  moodData,
  symptomsData,
  timesData,
  dosageData,
  wayData
};