/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/HelloSVG/HelloSVG.tsx

Created with;
$ npx generate-react-cli component HelloSVG --type=d3

*/

import React, { useState, useEffect, RefObject } from 'react'
import './HelloSVG.scss'
import * as d3 from 'd3' // yarn add d3 @types/d3

const HelloSVG = () /* or ( props : IHelloSVGProps ) */ => {
  const [myState, setMyState] = useState<Boolean>(true)
  const ref: RefObject<HTMLDivElement> = React.createRef()

  useEffect(() => {
    draw()
  })

  const draw = () => {
    d3.select(ref.current).append('p').text('Hello World')
    d3.select('svg')
      .append('g')
      .attr('transform', 'translate(250, 0)')
      .append('rect').attr('width', 500)
      .attr('height', 500)
      .attr('fill', 'tomato')
  }

  return (
    <div className="HelloSVG" ref={ref}>
      <svg width="500" height="500">
        <g transform="translate(0, 0)">
          <rect className="myRect" width="500" height="500" />
        </g>
      </svg>
    </div>
  )
}

/*
interface IHelloSVGProps {
  // TODO
}
*/

export default HelloSVG
