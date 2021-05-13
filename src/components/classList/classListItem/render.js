import React from "react";
import list from "./classList.less";
import Lazyload from "@/components/lazyload/root";
import CountDown from "@/components/CountDown/root";

/**
 * listTitle
 *
 */
export function listTitle(row) {
  return row.data ? (
    <p className={`${list.title} wrap-list f40`}>
      <img className="mr20" src={row.img} alt="" />
      <span>{row.title ? row.title : null}</span>
    </p>
  ) : null;
}

/**
 * 课程状态
 *
 * isRushOut： 停售
 * isSaleOut： 售罄
 * isTermined： 距待售
 */

export function classState(r) {
  const { isRushOut, isSaleOut } = r;

  // eslint-disable-next-line no-nested-ternary
  return isRushOut ? (
    <span>&nbsp;&nbsp;已停售</span>
  ) : isSaleOut ? (
    <span>&nbsp;&nbsp;已售罄</span>
  ) : null;
}

/**
 * limitType
 *
 */
export function limitType(r) {
  const isNoActualPrice =
    String(r.actualPrice) === "0" && String(r.actualPrice).length < 2;

  const limitMaps = {
    0:
      r.count != 0 ? (
        <span>
          {isNoActualPrice ? (
            <>
              {r.count}人报名{classState(r)}
            </>
          ) : r.collageActiveId > 0 ? (
            <>
              {r.count}人已拼{classState(r)}
            </>
          ) : (
            <>
              {r.count}人已抢{classState(r)}
            </>
          )}
        </span>
      ) : null,
    1: <span>限招 {r.limit} 人</span>,
    2: <span>仅剩 {parseInt(r.limit) - parseInt(r.count)} 人</span>,
  };

  return limitMaps[r.limitType];
}

/**
 * 金额
 * 1.actualPrice === 0 ：免费
 * 2.actualPrice > price ：划掉 price
 * 3.price == '' ：直接取 actualPrice
 */
export function withPrice(r) {
  const { isCollect, actualPrice, price } = r;
  // eslint-disable-next-line camelcase
  let price_render;

  if (isCollect || price === actualPrice || !price) {
    // eslint-disable-next-line camelcase
    price_render = (
      <span className="fr">
        <span className="f24">¥ </span>
        <strong className="f32">{actualPrice}</strong>
      </span>
    );
  } else {
    // eslint-disable-next-line camelcase
    price_render = (
      <span className="fr">
        <span className="f24">¥ </span>
        <strong className="f32">{actualPrice}</strong>
        {price ? (
          <del className="ml10" style={{ color: "#6C7172" }}>
            ¥{price}
          </del>
        ) : null}
      </span>
    );
  }

  if (String(actualPrice) === "0" && String(actualPrice).length < 2) {
    // eslint-disable-next-line camelcase
    price_render = (
      <span className="fr">
        <strong className="f32" style={{ color: "#5daf7d" }}>
          免费
        </strong>
        {price ? (
          <del className="ml10" style={{ color: "#6C7172" }}>
            ¥{price}
          </del>
        ) : null}
      </span>
    );
  }

  // eslint-disable-next-line camelcase
  return price_render;
}

/**
 * 老师头像
 *
 */
export function teacher(r) {
  return r.teacher
    ? r.teacher.map((t) => (
      <li className="fl" key={t.teacherName}>
        <p className="br50 oh">
          <Lazyload
            width="56"
            height="56"
            lazy={t.roundPhoto}
            alt="roundPhoto"
          />
        </p>
        <p>{t.teacherName}</p>
      </li>
      ))
    : null;
}

/**
 * 标签
 *
 */
export function activeTag(r) {
  return r.activeTag.map((t, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <span className="f20" key={index}>
      {t}
    </span>
  ));
}

/**
 * 活动倒计时
 *
 */
export function classCountDown(r) {
  const { saleStart, saleEnd, isTermined, terminedDesc } = r;
  let countDownEl;

  if (isTermined) {
    // 待售
    countDownEl = terminedDesc || "待售";
  } else if (saleStart !== 0 || saleEnd !== 0) {
    if (saleStart > 0) {
      countDownEl = (
        <>{<CountDown time={saleStart} type={3} beforeDesc="距开抢" />}</>
      );
    } else if (saleEnd > 0) {
      countDownEl = (
        <>{<CountDown time={saleEnd} type={3} beforeDesc="距停售" />}</>
      );
    }
  }

  return countDownEl || null;
}

/**
 * template
 *
 */
export function template(r, toCollectOrDetail) {
  return (
    <div key={r.id} data-id={r.id}>
      <div
        onClick={toCollectOrDetail(r)}
        className={`${list.classItem} wrap-list`}
      >
        <p className={`${list.collectTag} f26 mb10`}>
          {r.collectTag ? r.collectTag : null}
        </p>
        <p
          className={`${list.item_title} f32`}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: r.title ? r.title : null,
          }}
        />
        <p className={`${list.timeLength} f26 mt10`}>
          {r.timeLength ? r.timeLength : null}
        </p>
        <p className={`${list.classCountDown} f24 mt10`}>{classCountDown(r)}</p>
        <div className={`${list.teacher} clearfix mt30`}>
          <ul className="clearfix fl">{teacher(r)}</ul>
          <div className={list.others}>
            <p className={`${list.price} clearfix`}>{withPrice(r)}</p>
            {r.activeTag && r.activeTag.length > 0 ? (
              <div className={`${list.activeTag} clearfix`}>
                <p className="fr">{activeTag(r)}</p>
              </div>
            ) : null}
            <div className={`${list.limitType} clearfix`}>
              <span className="f24 fr">{limitType(r)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 合集底部样式 */}
      {r.isCollect ? (
        <div className={`${list.item_collect_bg}`} />
      ) : (
        <div className={`${list.item_border_bg}`} />
      )}
    </div>
  );
}
