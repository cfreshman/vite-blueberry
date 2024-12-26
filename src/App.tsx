import react from 'react'
import styled from 'styled-components'
import { asInput, new_trigger, S, useM, useS, useStored, useStyle } from './lib/use'
const { named_log, range, colors, node } = window as any
const log = named_log('App')


const App = () => {
  let [hidden, set_hidden] = useStored('blueberry-hidden', { default:{} })
  let count = useM(hidden, () => Object.values(hidden).filter(Boolean).length)
  useStyle(`
  :root {
    filter: none;
    background: #6a6aff;
    color: #226;
    font-weight: bold;
    height: 100%;
    overflow: hidden;
  }
  #app button {
    background: inherit;
  }
  `)
  return <Style id='app'>
    <div className='column gap' style={S(`
    word-break: break-all;
    `)}>
      {/* {'blueberry • '.repeat(1e4)} */}
      <div className='middle-row wide'>
        <i className='cute' onClick={e => {
          // set_hidden({})
        }}>you have eaten <span onClick={e => set_hidden({})}>{count}</span> blueberr{count===1?'y':'ies'}</i>
      </div>
      <div className='middle-row gap wrap'>
        {range(1e3).map(i => <button key={i} className='cute' style={S(`
        visibility: ${hidden[i] ? 'hidden' : 'visible'};
        `)} onClick={e => {
          set_hidden({ ...hidden, [i]: 1 })
        }}>blueberry</button>)}
      </div>
    </div>
  </Style>
}
const Style = styled.div``

export default App
