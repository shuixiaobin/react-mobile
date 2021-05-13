import React, { Component } from "react";
import { connect } from "dva";
import { formatTimestamp } from "@/utils/global";
import detail from "../classDetail.less";

class Schedule extends Component {
  componentDidMount() {
    const { dispatch, selectedLocation } = this.props;
    dispatch({
      type: "classDetail/getSchedule",
      payload: {
        id: selectedLocation.timetableId
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selectedLocation, dispatch } = this.props;
    if (
      nextProps.selectedLocation.timetableId !== selectedLocation.timetableId
    ) {
      dispatch({
        type: "classDetail/getSchedule",
        payload: {
          id: selectedLocation.timetableId
        }
      });
    }
  }

  handleShow(i) {
    const { dispatch } = this.props;
    dispatch({
      type: "classDetail/toggleSchedule",
      payload: i
    });
  }

  render() {
    const { scheduleList } = this.props;
    return (
      <ul className={detail.schedule}>
        {scheduleList.map((item, i) => (
          <li key={item.lessonTableId}>
            <div
              className={detail.titleWrapper}
              onClick={() => this.handleShow(i)}
            >
              <h3 className={`ellipsis ${detail.title}`}>
                {item.stageName}-{item.subjectName}
              </h3>
              <i
                className={`iconfont  ${
                  item.isShow ? "iconshanglabeifen" : "iconxiala2"
                }`}
              />
            </div>
            {item.timeTableList.map((each, k) => (
              <div key={k} className={`${item.isShow ? "db" : "dn"}`}>
                <div className={`${detail.date}`}>
                  <i className="iconfont iconshijian mr20" />
                  {item.timeTableList && formatTimestamp(each.lessonDate)}
                </div>
                <div
                  className={`${detail.scheduleItem}`}
                  key={each.lessonTableDetailId}
                >
                  {each.lessonTimeList.map((every, j) => (
                    <div className={`${detail.scheduleContainer} mt20`} key={j}>
                      <div className={detail.b_cir}>
                        <div className={detail.s_cir} />
                      </div>
                      <div className={`${detail.content} mr20 ml20`}>
                        <span className={detail.time}>
                          {formatTimestamp(every.startTime, true)} -{" "}
                          {formatTimestamp(every.endTime, true)}
                        </span>
                        <span className={detail.teacher}>
                          主讲：{each.teacherName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </li>
        ))}
      </ul>
    );
  }
}

const mapState = state => ({
  selectedLocation: state.classDetail.selectedLocation,
  scheduleList: state.classDetail.scheduleList
});

export default connect(mapState)(Schedule);
