import React, { Component } from "react";
import { connect } from "dva";
import style from "../groupStyle.less";
import { getClassExt } from "@/services/classApi";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      iconArr: {
        总课时数: "iconkebiaox1",
        课程时间: "iconkebiaox1",
        "活动时间：": "iconbianzu2",
        名师团队: "iconkebiaox4",
        学习资料: "iconxuexi-x",
        课程有效期: "iconkebiaox3",
        不支持: "iconVIPx",
        增值服务: "iconfuwux",
      },
      classExt: null,
    };
  }

  componentDidMount() {
    this.getClassExtFn();
  }

  async getClassExtFn() {
    try {
      const { classId } = this.props;
      await getClassExt({
        classId,
      })
        .then((res) => res.text())
        .then((data) => {
          this.setState({
            classExt: data,
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  handlePull = () => {
    const { isHidden } = this.state;
    this.setState({
      isHidden: !isHidden,
    });
  };

  render() {
    const { isHidden, iconArr, classExt } = this.state;
    const {
      columnHeaders,
      columnDetails,
      studyDate,
    } = this.props;

    return (
      <div className={`${style.detail} mt10`}>
        <h6 className={style.title}>课程详情</h6>
        <div className={style.container}>
          <ul
            className={`${style.listCon} ${
              isHidden === true && columnHeaders && columnHeaders.length > 3
                ? style.oh
                : ""
            }`}
            style={{
              borderBottom:
                columnHeaders && columnHeaders.length <= 3
                  ? "1px solid #E1E1E1"
                  : "",
            }}
          >
            {columnHeaders &&
              columnHeaders.map((item, index) => (
                <li className={style.item} key={item}>
                  <i
                    className={`${style.icon} iconfont ${iconArr[item]} mr20`}
                  />
                  <b className={style.blodWord}>{item}</b>
                  <span className={style.content}>{columnDetails[index]}</span>
                </li>
              ))}
          </ul>
          {columnHeaders && columnHeaders.length > 3 ? (
            <div className={style.pull} onClick={this.handlePull}>
              <i
                className={`iconfont ${
                  isHidden === true ? "iconxiala2" : "iconshanglabeifen"
                }`}
              />
            </div>
          ) : null}
          <div
            className={style.htmlText}
            dangerouslySetInnerHTML={{ __html: classExt }}
          />
        </div>
      </div>
    );
  }
}

export default connect()(Detail);
