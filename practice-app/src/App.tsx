import React,{useRef,useState,useEffect} from 'react'
import {select,selectAll,Selection} from 'd3-selection'
import {scaleLinear,scaleBand} from 'd3-scale'
import {max} from 'd3-array'
import {axisLeft, axisBottom} from 'd3-axis'
import "./App.css"
let initialData = [
  {
    "Recorded Value (dBA)": 64.5,
    "Time (seconds)": 1
  },
  {
    "Recorded Value (dBA)": 66.6,
    "Time (seconds)": 2
  },
  {
    "Recorded Value (dBA)": 62,
    "Time (seconds)": 3
  },
  {
    "Recorded Value (dBA)": 58.2,
    "Time (seconds)": 4
  },
  {
    "Recorded Value (dBA)": 58.4,
    "Time (seconds)": 5
  },
  {
    "Recorded Value (dBA)": 60.4,
    "Time (seconds)": 6
  },
  {
    "Recorded Value (dBA)": 61.5,
    "Time (seconds)": 7
  },
  {
    "Recorded Value (dBA)": 60,
    "Time (seconds)": 8
  },
  {
    "Recorded Value (dBA)": 60,
    "Time (seconds)": 9
  },
  {
    "Recorded Value (dBA)": 59.3,
    "Time (seconds)": 10
  },
  {
    "Recorded Value (dBA)": 58.6,
    "Time (seconds)": 11
  },
  {
    "Recorded Value (dBA)": 57.7,
    "Time (seconds)": 12
  },
  {
    "Recorded Value (dBA)": 60.5,
    "Time (seconds)": 13
  },
  {
    "Recorded Value (dBA)": 57.8,
    "Time (seconds)": 14
  },
  {
    "Recorded Value (dBA)": 57.1,
    "Time (seconds)": 15
  },
  {
    "Recorded Value (dBA)": 61.6,
    "Time (seconds)": 16
  },
  {
    "Recorded Value (dBA)": 56.5,
    "Time (seconds)": 17
  },
  {
    "Recorded Value (dBA)": 54.2,
    "Time (seconds)": 18
  },
  {
    "Recorded Value (dBA)": 55.5,
    "Time (seconds)": 19
  },
  {
    "Recorded Value (dBA)": 58.1,
    "Time (seconds)": 20
  },
  {
    "Recorded Value (dBA)": 56.3,
    "Time (seconds)": 21
  },
  {
    "Recorded Value (dBA)": 56.3,
    "Time (seconds)": 22
  },
  {
    "Recorded Value (dBA)": 59.9,
    "Time (seconds)": 23
  },
  {
    "Recorded Value (dBA)": 58.5,
    "Time (seconds)": 24
  },
  {
    "Recorded Value (dBA)": 59.8,
    "Time (seconds)": 25
  },
  {
    "Recorded Value (dBA)": 63.1,
    "Time (seconds)": 26
  },
  {
    "Recorded Value (dBA)": 61,
    "Time (seconds)": 27
  },
  {
    "Recorded Value (dBA)": 58.3,
    "Time (seconds)": 28
  },
  {
    "Recorded Value (dBA)": 52.4,
    "Time (seconds)": 29
  },
  {
    "Recorded Value (dBA)": 58.5,
    "Time (seconds)": 30
  },
  {
    "Recorded Value (dBA)": 48.5,
    "Time (seconds)": 31
  },
  {
    "Recorded Value (dBA)": 49,
    "Time (seconds)": 32
  },
  {
    "Recorded Value (dBA)": 49.5,
    "Time (seconds)": 33
  },
  {
    "Recorded Value (dBA)": 61.4,
    "Time (seconds)": 34
  },
  {
    "Recorded Value (dBA)": 57.7,
    "Time (seconds)": 35
  },
  {
    "Recorded Value (dBA)": 59.9,
    "Time (seconds)": 36
  },
  {
    "Recorded Value (dBA)": 62,
    "Time (seconds)": 37
  },
  {
    "Recorded Value (dBA)": 61.8,
    "Time (seconds)": 38
  },
  {
    "Recorded Value (dBA)": 62.6,
    "Time (seconds)": 39
  },
  {
    "Recorded Value (dBA)": 62,
    "Time (seconds)": 40
  },
  {
    "Recorded Value (dBA)": 63.1,
    "Time (seconds)": 41
  },
  {
    "Recorded Value (dBA)": 60.3,
    "Time (seconds)": 42
  },
  {
    "Recorded Value (dBA)": 58.3,
    "Time (seconds)": 43
  },
  {
    "Recorded Value (dBA)": 60.5,
    "Time (seconds)": 44
  },
  {
    "Recorded Value (dBA)": 53.7,
    "Time (seconds)": 45
  },
  {
    "Recorded Value (dBA)": 51.1,
    "Time (seconds)": 46
  },
  {
    "Recorded Value (dBA)": 48.8,
    "Time (seconds)": 47
  },
  {
    "Recorded Value (dBA)": 60.2,
    "Time (seconds)": 48
  },
  {
    "Recorded Value (dBA)": 57.3,
    "Time (seconds)": 49
  },
  {
    "Recorded Value (dBA)": 61.4,
    "Time (seconds)": 50
  },
  {
    "Recorded Value (dBA)": 61.4,
    "Time (seconds)": 51
  },
  {
    "Recorded Value (dBA)": 60.3,
    "Time (seconds)": 52
  },
  {
    "Recorded Value (dBA)": 59.7,
    "Time (seconds)": 53
  },
  {
    "Recorded Value (dBA)": 62.2,
    "Time (seconds)": 54
  },
  {
    "Recorded Value (dBA)": 61.6,
    "Time (seconds)": 55
  },
  {
    "Recorded Value (dBA)": 58.8,
    "Time (seconds)": 56
  },
  {
    "Recorded Value (dBA)": 53.8,
    "Time (seconds)": 57
  },
  {
    "Recorded Value (dBA)": 59,
    "Time (seconds)": 58
  },
  {
    "Recorded Value (dBA)": 49.2,
    "Time (seconds)": 59
  },
  {
    "Recorded Value (dBA)": 48.3,
    "Time (seconds)": 60
  },
  {
    "Recorded Value (dBA)": 51.2,
    "Time (seconds)": 61
  },
  {
    "Recorded Value (dBA)": 62.3,
    "Time (seconds)": 62
  },
  {
    "Recorded Value (dBA)": 61.6,
    "Time (seconds)": 63
  },
  {
    "Recorded Value (dBA)": 60.2,
    "Time (seconds)": 64
  },
  {
    "Recorded Value (dBA)": 61.7,
    "Time (seconds)": 65
  },
  {
    "Recorded Value (dBA)": 58.3,
    "Time (seconds)": 66
  },
  {
    "Recorded Value (dBA)": 58.3,
    "Time (seconds)": 67
  },
  {
    "Recorded Value (dBA)": 61.1,
    "Time (seconds)": 68
  },
  {
    "Recorded Value (dBA)": 62.3,
    "Time (seconds)": 69
  },
  {
    "Recorded Value (dBA)": 60,
    "Time (seconds)": 70
  },
  {
    "Recorded Value (dBA)": 56.7,
    "Time (seconds)": 71
  },
  {
    "Recorded Value (dBA)": 59.2,
    "Time (seconds)": 72
  },
  {
    "Recorded Value (dBA)": 58.1,
    "Time (seconds)": 73
  },
  {
    "Recorded Value (dBA)": 55.1,
    "Time (seconds)": 74
  },
  {
    "Recorded Value (dBA)": 53.7,
    "Time (seconds)": 75
  },
  {
    "Recorded Value (dBA)": 59.3,
    "Time (seconds)": 76
  },
  {
    "Recorded Value (dBA)": 56.1,
    "Time (seconds)": 77
  },
  {
    "Recorded Value (dBA)": 58.3,
    "Time (seconds)": 78
  },
  {
    "Recorded Value (dBA)": 60.8,
    "Time (seconds)": 79
  },
  {
    "Recorded Value (dBA)": 60.9,
    "Time (seconds)": 80
  },
  {
    "Recorded Value (dBA)": 59.9,
    "Time (seconds)": 81
  },
  {
    "Recorded Value (dBA)": 61,
    "Time (seconds)": 82
  },
  {
    "Recorded Value (dBA)": 60.3,
    "Time (seconds)": 83
  },
  {
    "Recorded Value (dBA)": 56.9,
    "Time (seconds)": 84
  },
  {
    "Recorded Value (dBA)": 59.6,
    "Time (seconds)": 85
  },
  {
    "Recorded Value (dBA)": 59.3,
    "Time (seconds)": 86
  },
  {
    "Recorded Value (dBA)": 61.2,
    "Time (seconds)": 87
  },
  {
    "Recorded Value (dBA)": 59.6,
    "Time (seconds)": 88
  },
  {
    "Recorded Value (dBA)": 59.3,
    "Time (seconds)": 89
  },
  {
    "Recorded Value (dBA)": 59,
    "Time (seconds)": 90
  },
  {
    "Recorded Value (dBA)": 54.4,
    "Time (seconds)": 91
  },
  {
    "Recorded Value (dBA)": 59.3,
    "Time (seconds)": 92
  },
  {
    "Recorded Value (dBA)": 59.7,
    "Time (seconds)": 93
  },
  {
    "Recorded Value (dBA)": 58.4,
    "Time (seconds)": 94
  },
  {
    "Recorded Value (dBA)": 58.1,
    "Time (seconds)": 95
  },
  {
    "Recorded Value (dBA)": 57.4,
    "Time (seconds)": 96
  },
  {
    "Recorded Value (dBA)": 62.3,
    "Time (seconds)": 97
  },
  {
    "Recorded Value (dBA)": 61.2,
    "Time (seconds)": 98
  },
  {
    "Recorded Value (dBA)": 59.1,
    "Time (seconds)": 99
  },
  {
    "Recorded Value (dBA)": 60.3,
    "Time (seconds)": 100
  },
  {
    "Recorded Value (dBA)": 58.1,
    "Time (seconds)": 101
  },
  {
    "Recorded Value (dBA)": 55.6,
    "Time (seconds)": 102
  },
  {
    "Recorded Value (dBA)": 54.7,
    "Time (seconds)": 103
  },
  {
    "Recorded Value (dBA)": 58.6,
    "Time (seconds)": 104
  },
  {
    "Recorded Value (dBA)": 53.6,
    "Time (seconds)": 105
  },
  {
    "Recorded Value (dBA)": 55,
    "Time (seconds)": 106
  },
  {
    "Recorded Value (dBA)": 61.1,
    "Time (seconds)": 107
  },
  {
    "Recorded Value (dBA)": 58,
    "Time (seconds)": 108
  },
  {
    "Recorded Value (dBA)": 61.4,
    "Time (seconds)": 109
  },
  {
    "Recorded Value (dBA)": 63.7,
    "Time (seconds)": 110
  },
  {
    "Recorded Value (dBA)": 63.5,
    "Time (seconds)": 111
  },
  {
    "Recorded Value (dBA)": 63,
    "Time (seconds)": 112
  },
  {
    "Recorded Value (dBA)": 60.1,
    "Time (seconds)": 113
  },
  {
    "Recorded Value (dBA)": 58.7,
    "Time (seconds)": 114
  },
  {
    "Recorded Value (dBA)": 58,
    "Time (seconds)": 115
  },
  {
    "Recorded Value (dBA)": 58.1,
    "Time (seconds)": 116
  },
  {
    "Recorded Value (dBA)": 60,
    "Time (seconds)": 117
  },
  {
    "Recorded Value (dBA)": 61.9,
    "Time (seconds)": 118
  },
  {
    "Recorded Value (dBA)": 62.2,
    "Time (seconds)": 119
  },
  {
    "Recorded Value (dBA)": 60.7,
    "Time (seconds)": 120
  },
  {
    "Recorded Value (dBA)": 61.8,
    "Time (seconds)": 121
  },
  {
    "Recorded Value (dBA)": 61.9,
    "Time (seconds)": 122
  },
  {
    "Recorded Value (dBA)": 62.5,
    "Time (seconds)": 123
  },
  {
    "Recorded Value (dBA)": 65.8,
    "Time (seconds)": 124
  },
  {
    "Recorded Value (dBA)": 65.6,
    "Time (seconds)": 125
  },
  {
    "Recorded Value (dBA)": 64,
    "Time (seconds)": 126
  },
  {
    "Recorded Value (dBA)": 59.2,
    "Time (seconds)": 127
  },
  {
    "Recorded Value (dBA)": 60.3,
    "Time (seconds)": 128
  },
  {
    "Recorded Value (dBA)": 62.3,
    "Time (seconds)": 129
  },
  {
    "Recorded Value (dBA)": 60.5,
    "Time (seconds)": 130
  },
  {
    "Recorded Value (dBA)": 59.3,
    "Time (seconds)": 131
  },
  {
    "Recorded Value (dBA)": 63,
    "Time (seconds)": 132
  },
  {
    "Recorded Value (dBA)": 58.3,
    "Time (seconds)": 133
  },
  {
    "Recorded Value (dBA)": 57,
    "Time (seconds)": 134
  },
  {
    "Recorded Value (dBA)": 59.1,
    "Time (seconds)": 135
  },
  {
    "Recorded Value (dBA)": 62,
    "Time (seconds)": 136
  },
  {
    "Recorded Value (dBA)": 59.6,
    "Time (seconds)": 137
  },
  {
    "Recorded Value (dBA)": 59.8,
    "Time (seconds)": 138
  },
  {
    "Recorded Value (dBA)": 62.8,
    "Time (seconds)": 139
  },
  {
    "Recorded Value (dBA)": 59.5,
    "Time (seconds)": 140
  },
  {
    "Recorded Value (dBA)": 57.7,
    "Time (seconds)": 141
  },
  {
    "Recorded Value (dBA)": 61.5,
    "Time (seconds)": 142
  },
  {
    "Recorded Value (dBA)": 63.4,
    "Time (seconds)": 143
  },
  {
    "Recorded Value (dBA)": 61.9,
    "Time (seconds)": 144
  },
  {
    "Recorded Value (dBA)": 60.2,
    "Time (seconds)": 145
  },
  {
    "Recorded Value (dBA)": 63.5,
    "Time (seconds)": 146
  },
  {
    "Recorded Value (dBA)": 61.7,
    "Time (seconds)": 147
  },
  {
    "Recorded Value (dBA)": 58.8,
    "Time (seconds)": 148
  },
  {
    "Recorded Value (dBA)": 61.8,
    "Time (seconds)": 149
  }
 ]

interface AppProps {

}
const dimensions = {
  width :1500,
  height:200
}

const App: React.FC<AppProps> = ({}) => {

    const ref = useRef<SVGSVGElement|null>(null)
    const [selection,setSelection] = useState<null|Selection<SVGSVGElement | null, unknown, null, undefined>>(null)
    const[data,setData]= useState(initialData)

    let y = scaleLinear()
      .domain([0,max(data,d=>d['Recorded Value (dBA)'])!])
      .range([dimensions.height,0])

    const x = scaleBand()
      .domain(data.map(d=>String(d['Time (seconds)'])))
      .range([0,dimensions.width])
      .paddingInner(0.05)


    useEffect(()=>{
      if(!selection){
        setSelection(select(ref.current))
      }
      else{
        selection
          .append("g")
          .attr("class", "grid")
          .call(axisLeft(y)
                .tickSize(-dimensions.width)
                
          )
          .selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('width',x.bandwidth)
          .attr('height',d=>dimensions.height- y(d['Recorded Value (dBA)']))
          .attr('x',d=>x(String(d['Time (seconds)']))!)
          .attr('y',d=>y(d['Recorded Value (dBA)']))
          .attr("fill", function(d, i) {
            return d['Recorded Value (dBA)'] > 60 ? "red" : "grey";
            })
          
              
          
      }

    },[selection])

    useEffect(()=>{
      if(selection){
        let y = scaleLinear()
        .domain([0,max(data,d=>d['Recorded Value (dBA)'])!])
        .range([dimensions.height,0])

        const x = scaleBand()
          .domain(data.map(d=>String(d['Time (seconds)'])))
          .range([0,dimensions.width])
          .paddingInner(0.05)

          const rects = selection.selectAll('rect').data(data)

          rects
            .exit()
            .remove()

          rects
          .attr('width',x.bandwidth)
          .attr('height',d=>dimensions.height- y(d['Recorded Value (dBA)']))
          .attr('x',d=>x(String(d['Time (seconds)']))!)
          .attr('y',d=>y(d['Recorded Value (dBA)']))
          .attr("fill", function(d, i) {
            return d['Recorded Value (dBA)'] > 60 ? "red" : "grey";
            })

          rects
            .enter()
            .append('rect')
            .attr('width',x.bandwidth)
            .attr('height',d=>dimensions.height- y(d['Recorded Value (dBA)']))
            .attr('x',d=>x(String(d['Time (seconds)']))!)
            .attr('y',d=>y(d['Recorded Value (dBA)']))
            .attr("fill", function(d, i) {
              return d['Recorded Value (dBA)'] > 60 ? "red" : "grey";
              })
      }


    },[data])

    
    const addRandom = () =>{
      const dataToBeAdded = {
        "Recorded Value (dBA)": Math.floor(Math.random()*(18.6)+48.3),
        "Time (seconds)": data.length+1
      }
      
      setData([...data,dataToBeAdded])
    }

    const removeLast = ()=>{
      if(data.length ===0){
        return
      }
      const slicedData = data.slice(0,data.length-1)
      setData(slicedData)


    }
    
    return (
      <div>
        <svg ref={ref} width={dimensions.width} height ={dimensions.height}/>
        <button onClick={addRandom}>Add Random</button>
        <button onClick={removeLast}>Remove Last</button>
      </div>
    );
}

export default App