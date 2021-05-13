/**
 * 合集，课程列表
 */
import React from "react";
import { routerRedux, withRouter } from "dva/router";
import { connect } from "dva";
import list from "./classList.less";
import { listTitle, template } from "./render"; // classList render
import { SearchResultCourse, CilckButton } from "@/utils/setSensors";

/**
 * classList item 组件
 * @param {object} row 当前数据
 */
function ListItem({ row, ...props }) {
  const {
    myUrl,
    dispatch,
    userName,
    location: { pathname },
  } = props;
  const exp = typeof row.data !== "undefined";

  // 埋点
  const track = (r) => {
    const { pageNumber, keyWord, classList } = props;

    SearchResultCourse({
      page_number: pageNumber - 1, // reducer - 1
      course_id: r.classId,
      course_title: r.titles,
      search_keyword: keyWord,
      click_number:
        classList.findIndex((item) => item.classId === r.classId) + 1,
      teacher_name: r.teacher.map((item) => item.teacherName),
      discount_price: r.actualPrice,
      course_price: r.price,
      is_free: String(r.actualPrice) === "0",
    });
  };

  /**
   * 跳转合集列表，课程详情，秒杀
   */
  const toCollectOrDetail = (r) => () => {
    const {
      collectId,
      title,
      classId,
      collageActiveId,
      secondKill,
      price,
      actualPrice,
      isNew,
      defaultId,
    } = r;
    // 点击课程搜索结果埋点
    if (pathname === "/search") {
      track(r);
    }

    // 区分秒杀课
    if (secondKill) {
      // 秒杀登录验证
      if (userName) {
        const skURl = `${SK_URL}${classId}.html`;
        window.location.href = skURl;
      } else {
        dispatch({
          type: "all/showLogin",
        });
      }
    } else {
      /**
       * classList item 组件
       * @param {Number} collectId 合集id
       * @param {Number} isNew 是否是新合集
       */
      // const route = collectId
      //   ? isNew
      //     ? {
      //         pathname: '/class/classDetail',
      //         search: qs.stringify({ collageActiveId, classId: defaultId })
      //       }
      //     : {
      //         pathname: '/other/collectList',
      //         search: qs.stringify({
      //           collectId,
      //           title: encodeURI(title),
      //           fetchListApi: 'getCollectList'
      //         })
      //       }
      //   : {
      //       pathname: '/class/classDetail',
      //       search: qs.stringify({ collageActiveId, classId })
      //     }

      let route;
      if (collectId) {
        if (isNew) {
          route = {
            pathname: "/class/classDetail",
            search: qs.stringify({ collageActiveId, classId: defaultId ,isNew, collectionId:collectId}),
          };
        } else {
          route = {
            pathname: "/other/collectList",
            search: qs.stringify({
              collectId,
              title: encodeURI(title),
              fetchListApi: "getCollectList",
            }),
          };
        }
      } else if (collageActiveId > 0) {
          route = {
            pathname: "/class/groupClass",
            search: qs.stringify({ collageActiveId, classId }),
          };
      } else {
          route = {
            pathname: "/class/classDetail",
            search: qs.stringify({ collageActiveId, classId}),
          };
      }

      dispatch(routerRedux.push({ ...route }));
    }
  };

  /**
   * 跳转类型集合列表
   */
  const toCateDetailList = (r) => () => {
    // 神策按钮埋点
    CilckButton({
      on_page: "首页",
      first_module: "课程列表",
      button_name: "查看更多",
    });
    const { cateId, typeId, title } = r;
    const route = {
      pathname: "/other/collectList",
      search: qs.stringify({
        cateId,
        typeId,
        title: encodeURI(title),
        fetchListApi: "getCateDetailList",
      }),
    };

    dispatch(routerRedux.push({ ...route }));
  };

  return (
    <div key={row} className={list.classList}>
      {exp ? listTitle(row) : null}
      {exp
        ? row.data.map((r) => template(r, toCollectOrDetail))
        : template(row, toCollectOrDetail)}
      {exp && row.more ? (
        <div className={list.getMore} onClick={toCateDetailList(row)}>
          <img src={`${myUrl}get-more.png`} alt="" />
        </div>
      ) : null}
    </div>
  );
}

const mapState = (state) => ({
  userName: state.all.userName,
  myUrl: state.all.myUrl,
  keyWord: state.all.keyWord,
  pageNumber: state.listView.page,
  classList: state.listView.list,
});

export default withRouter(connect(mapState)(ListItem));
