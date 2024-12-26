import { useEffect, useMemo, useRef, useState } from "react"
const { named_log, store, node } = window as any
const log = named_log('use')


export type supplier<T> = () => T
export type consumer<T> = (value:T) => void
export type transformer<T,U> = (value:T) => U

export const useS = <T=any,>(value: T): [T, consumer<T>] => {
  return useState(value)
}

export const useE = (...props_func: any[]) => {
  return useEffect(props_func.pop(), props_func)
}
export const useF = (...props_func: any[]) => {
  const func = props_func.pop()
  return useEffect(() => {func()}, props_func)
}

export const useM = <T=any,>(...props_func: any[]): T => {
  return useMemo(props_func.pop(), props_func)
}

export const useR = useRef<any>

export const new_trigger = <T=any,>(value: T) => {
  let ons: consumer<T>[] = []
  const initial = value
  const object = {
    get value() { return value },
    set value(v) {
      value = v
      ons.forEach(on => on(v))
    },
    set: (v: T): void => {object.value = v},
    on: (on: (value: T) => void) => {
      ons.push(on)
      return () => object.off(on)
    },
    off: (on: (value: T) => void) => {
      ons = ons.filter(o => o !== on)
    },
    use: (): [T, consumer<T>] => {
      const [v, set_v] = useS(object.value)
      useEffect(() => object.on(set_v), [])
      return [v, (v: T) => object.set(v)]
    },
    reset: () => object.value = initial,
  }
  return object
}

const _stored_loaded = {}
export const useStored = <T=any,>(key: string, opts:{ default?:T, defaulter?:supplier<T> }={}): [T, consumer<T>] => {
  const static_key = useM(() => key)
  const [value, set_value] = useS<T>(store.get(static_key) ?? opts.default ?? opts.defaulter?.())
  const trigger = useM(() => {
    let trigger = _stored_loaded[static_key]
    if (!trigger) trigger = _stored_loaded[static_key] = new_trigger(value)
    return trigger
  })
  useE(() => trigger.on(set_value))
  useF(value, () => {
    if (trigger.value === value) return
    store.set(static_key, value)
    trigger.value = value
  })
  return [value, set_value]
}

export const useStyle = (...props_and_style) => {
  const style = props_and_style.pop()
  useEffect(() => {
    const node_style = node('style')
    node_style.innerHTML = style
    document.head.appendChild(node_style)
    return () => node_style.remove()
  }, props_and_style)
}

export const asInput = <T,>([value, set_value]: [T, consumer<T>]): [T, consumer<T>, { value:T, onChange }] => {
  return [value, set_value, {
    value,
    onChange: (e: any) => set_value(e.target.value ?? e.target.checked),
  }]
}

export const S = (string: string): any => {
  const style = {}
  string.trim().split(';').map(x => x.trim()).filter(x=>x).forEach(pair => {
    const [key, value] = pair.split(':')
    if (key.startsWith('//')) return
    style[key] = value.trim()
  })
  return style
}