// 获得角度
function getAngle(angx, angy) {
  return (Math.atan2(angy, angx) * 180) / Math.PI
}

// 根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
// eslint-disable-next-line import/prefer-default-export
export function getDirection(startx, starty, endx, endy) {
  const angx = endx - startx
  const angy = endy - starty
  let result = 0

  // 如果滑动距离太短
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    return result
  }

  const angle = getAngle(angx, angy)
  if (angle >= -135 && angle <= -45) {
    result = 1
  } else if (angle > 45 && angle < 135) {
    result = 2
  } else if (
    (angle >= 135 && angle <= 180) ||
    (angle >= -180 && angle < -135)
  ) {
    result = 3
  } else if (angle >= -45 && angle <= 45) {
    result = 4
  }

  return result
}
