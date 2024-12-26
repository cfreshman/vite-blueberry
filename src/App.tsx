import react from 'react'
import styled from 'styled-components'
import { asInput, new_trigger, S, useM, useS, useStored, useStyle } from './lib/use'
const { named_log, colors, node } = window as any
const log = named_log('App')


const trigger_color = new_trigger<string>(undefined)

const App = () => {
  const [count, set_count] = useStored('app-count', { default:0 })
  const [count_2, set_count_2] = useStored('app-count', { default:0 })
  const [color, set_color] = trigger_color.use()
  const color_readable = useM(color, () => {
    const test_node = node(`<div style="color:${color};"></div>`)
    document.body.appendChild(test_node)
    const rgb = getComputedStyle(test_node).color
    test_node.remove()
    return colors.readable(colors.to_hex(rgb))
  })
  const [text, set_text, fill_text] = asInput(useS('hello world'))

  useStyle(color, `
  #app {
    ${color ? `
    button, input {
      background: ${color};
      color: ${color_readable};
    }
    ` : ''}
  }
  `)
  return <Style id='app'>
    <div className='column gap'>
      <span style={S(`
      white-space: pre-wrap;
      `)}>{text||' '}</span>
      <div className='row gap'>
        <button className='cute' onClick={e => set_count(count + 1)}>count: {count}</button>
        <button className='cute' onClick={e => set_count_2(count_2 + 1)}>count: {count_2}</button>
      </div>
      <div className='row gap'>
        <button className='cute' onClick={e => set_color('red')}>red</button>
        <button className='cute' onClick={e => set_color('gold')}>gold</button>
        <button className='cute' onClick={e => set_color('green')}>green</button>
        <button className='cute' onClick={e => set_color('blue')}>blue</button>
      </div>
      <input className='cute' {...fill_text} />
      <button className='cute' onClick={e => {
        set_count(0)
        trigger_color.reset()
        set_text('hello world')
      }}>reset</button>
    </div>
  </Style>
}
const Style = styled.div``

export default App
