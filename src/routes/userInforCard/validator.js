import {
  Edu,
  NetClassType,
  stage,
  classTime,
  Age,
  ExamExperience
} from './validatorJson'

const Utils = {
  ePattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, // Email正则
  mPattern: /^1[3|4|5|7|8|9|6][0-9]\d{8}$/, // 手机号正则
  cP: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 身份证号（18位）正则
  cP15: /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/, // 身份证号（15位）正则
  qqPattern: /^[1-9][0-9]{4,10}$/, // QQ号正则，5至11位
  han: /^[\u4e00-\u9fa5]+$/, // 全中文
  hanMin: /.*?[\\u4e00-\\u9fa5].*?[\\u4e00-\\u9fa5].*/
}

const writeContent = text => `请填写${text}`
const selectContent = text => `请选择${text}`
const formatContent = text => `${text}格式不正确哦～`

const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)
let minDate = new Date(nowTimeStamp - 1e7)
const maxDate = new Date(nowTimeStamp + 1e7)

if (minDate.getDate() !== maxDate.getDate()) {
  // set the minDate to the 0 of maxDate
  minDate = new Date(
    maxDate.getFullYear(),
    maxDate.getMonth(),
    maxDate.getDate()
  )
}

// 初始化 placeholder
const setPlaceholder = ary => {
  Object.keys(ary).map(k => {
    const cur = ary[k]
    if (cur.placeholder) return
    cur.placeholder = '请填写'
  })
}

/**
 * select 下拉
 * check 选择
 * popup 弹窗
 * rules 校验规则
 * max 限制字符长度
 * initialValue 初始文案
 * placeholder 提示
 * type inp 类型
 */
// eslint-disable-next-line import/prefer-defaults-export
const validators = {
  // global
  学员姓名: {
    rules: [
      {
        message: writeContent('学员姓名'),
        required: true
      },
      {
        pattern: Utils.han,
        // message: writeContent('真实姓名'),
        message: '请填写你的真实姓名哦~'
      },
      {
        // message: writeContent('真实姓名'),
        message: '请填写你的真实姓名哦~',
        type: 'string',
        min: 2,
        max: 10
      }
    ],
    placeholder: '必填',
    max: 10
  },

  性别: {
    rules: [{ message: selectContent('性别'), required: true }],
    check: {
      checkData: [
        {
          label: '女',
          value: 2
        },
        {
          label: '男',
          value: 1
        }
      ]
    },
    defaults: {
      initialValue: 2
    }
  },

  手机号码: {
    rules: [
      { message: writeContent('手机号'), required: true },
      { pattern: Utils.mPattern, message: formatContent('手机号') }
    ],
    placeholder: '必填',
    type: 'number'
  },

  // sign_up
  身份证号: {
    rules: [
      { message: writeContent('身份证号'), required: true },
      { pattern: Utils.cP || Utils.cP15, message: formatContent('身份证号') }
    ],
    placeholder: '必填'
  },

  针对考试: {
    rules: [{ message: writeContent('针对考试'), required: true }],
    placeholder: '必填，如：2013年北京公务员考试'
  },

  准考证号: {
    rules: [{ message: writeContent('准考证号'), required: true }],
    type: 'number',
    placeholder: '必填'
  },

  退费银行: {
    rules: [{ message: writeContent('退费银行'), required: false }],
    max: 25,
    placeholder: '如：工商银行北京分行魏公村支行'
  },

  银行户名: {
    rules: [{ message: writeContent('银行户名'), required: false }],
    max: 25
  },

  银行账号: {
    rules: [{ message: writeContent('银行账号'), required: false }],
    max: 25,
    type: 'bankCard'
  },

  // one_to_one
  // 教师
  学历: {
    rules: [{ message: selectContent('学历'), required: true }],
    select: {
      cols: 1,
      title: '学历',
      data: Edu
    },
    defaults: {
      initialValue: [1] // 研究生以上
    }
  },

  专业: {
    rules: [{ message: writeContent('专业'), required: true }],
    max: 25
  },

  // 自动抓取学员买课的课程名称 ，动态 initialValue
  课程名称: {
    rules: [{ message: writeContent('课程名称'), required: false }]
  },

  相关考试经历: {
    rules: [{ message: writeContent('相关考试经历'), required: false }],
    max: 25,
    placeholder: '如：有教师资格证面试经历'
  },

  报考学段: {
    rules: [{ message: selectContent('报考学段'), required: true }],
    select: {
      cols: 1,
      title: '报考学段',
      data: stage
    },
    defaults: {
      initialValue: [2] // 小学
    }
  },

  报考科目: {
    rules: [{ message: writeContent('报考科目'), required: true }],
    max: 20
  },

  报考地区: {
    rules: [{ message: writeContent('报考地区'), required: true }],
    max: 25
  },

  可上课时间段: {
    rules: [{ message: selectContent('可上课时间段'), required: true }],
    select: {
      cols: 1,
      title: '可上课时间段',
      data: classTime
    }
  },

  // 非教师
  QQ号: {
    rules: [
      { message: writeContent('QQ号'), required: true },
      { pattern: Utils.qqPattern, message: formatContent('QQ号') }
    ],
    type: 'number'
  },

  考试类别: {
    rules: [{ message: writeContent('考试类别'), required: true }]
  },

  考试经历: {
    rules: [{ message: selectContent('考试经历'), required: true }],
    select: {
      cols: 1,
      title: '考试经历',
      data: ExamExperience
    },
    defaults: {
      initialValue: '有'
    }
  },

  笔试面试: {
    rules: [{ message: selectContent('笔试面试'), required: true }],
    select: {
      cols: 1,
      title: '笔试面试',
      data: NetClassType
    },
    defaults: {
      initialValue: [1] // 笔试
    }
  },

  报考职位: {
    rules: [{ message: writeContent('报考职位'), required: true }],
    max: 25
  },

  额外要求: {
    rules: [{ message: writeContent('额外要求'), required: true }],
    popup: true
  },

  年龄: {
    rules: [{ message: selectContent('年龄'), required: false }],
    select: {
      cols: 1,
      title: '年龄',
      data: Age
    },
    defaults: { initialValue: [18] }
  },

  // 笔试
  职位招聘人数: {
    rules: [{ message: writeContent('职位招聘人数'), required: false }],
    max: 10,
    type: 'number'
  },

  笔试时间: {
    rules: [{ message: selectContent('笔试时间'), required: false }],
    select: {
      title: '笔试时间',
      type: 'Date',
      mode: 'date',
      extra: 'Optional',
      format: 'YYYY-MM-DD',
      minDate,
      maxDate
    },
    defaults: {
      initialValue: now
    }
  },

  // 面试
  分数和名次: {
    rules: [{ message: writeContent('分数和名次'), required: true }],
    type: 'number',
    max: 10
  },

  面试时间: {
    rules: [{ message: selectContent('面试时间'), required: false }],
    select: {
      title: '面试时间',
      type: 'Date',
      mode: 'date',
      extra: 'Optional',
      format: 'YYYY-MM-DD',
      minDate,
      maxDate
    },
    defaults: {
      initialValue: now
    }
  },

  面试比例: {
    rules: [{ message: writeContent('面试比例'), required: false }],
    max: 10
  }
}

setPlaceholder(validators)

export default validators
