import React from 'react'
import zfxPNG from '@/assets/image/zfx.png'
import cfxPNG from '@/assets/image/cfx.png'

const threshold = [0.01] // 触发时机

// eslint-disable-next-line compat/compat
const io = new IntersectionObserver(
  entries => {
    entries.forEach(ele => {
      if (ele.intersectionRatio <= 0) return // intersectionRatio 可见度
      const { target } = ele
      const { load, src } = target.dataset
      if (!load && src && target.src !== src) {
        target.src = src
        target.dataset.load = true
      }
    })
  },
  {
    threshold
  }
)

const onload = e => {
  io.observe(e.target)
  window.dispatchEvent(new Event('resize'))
}

const LazyLoadPage = ({ lazy, width, height, styles }) => {
  let defaultSrc

  if (width && height && width / height === 1) {
    defaultSrc = zfxPNG
  } else {
    defaultSrc = cfxPNG
  }

  return (
    <>
      {
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          onLoad={onload}
          onError={e => {
            const { target } = e
            target.src = defaultSrc
          }}
          onMouseDown={e => {
            e.preventDefault()
          }}
          draggable="false"
          style={{ ...styles, width, height }}
          src={defaultSrc}
          data-src={lazy}
        />
      }
    </>
  )
}

export default LazyLoadPage
