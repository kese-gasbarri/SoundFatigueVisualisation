import React,{useRef, useEffect, useState} from 'react';
import {select, selectAll,Selection} from 'd3-selection';
import {scaleLinear, scaleBand} from 'd3-scale';
import {max} from 'd3-array'
const data = [
  {
    name:'foo',
    number:9000
  },
  {
    name:'bar',
    number:2340
  },
  {
    name:'baz',
    number:3463
  },
  {
    name:'hoge',
    number:7654
  },
  {
    name:'piyo',
    number:8746
  },

]
interface AppProps {

}

const App: React.FC<AppProps> = ({}) => {
  const ref = useRef<SVGSVGElement |null>(null)
  const [selection,setSelection]= useState<null | Selection<
    SVGSVGElement | null, unknown, null, undefined>>(null);

  const maxValue = max(data, d=>d.number)



  const y = scaleLinear()
    .domain([0,maxValue!])
    .range([0,500])

  const x = scaleBand()
    .domain(data.map(d=>d.name))
    .range([0,800])
    .paddingInner(0.05)
    .paddingOuter(0.7)


  useEffect(()=>{
    if(!selection){
      setSelection(select(ref.current))
    }
    else{
      //console.log("y(0)",y(0))
      //console.log("y(2305)",y(2305))
      //console.log("y(8754)",y(8754))
      selection 
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width',x.bandwidth)
        .attr('x',d=>{
          const xValue = x(d.name)
          if(xValue){
            return xValue
          }
          else{
            return null
          }
        })
        .attr('fill','orange')
        .attr('height',d=>y(d.number));
    }

  },[selection])
    return (
      <div>
        <svg ref={ref} width = {800} height = {500}/>
      </div>
    );
}


export default App
