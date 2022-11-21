import React, { createContext, useContext } from 'react'
import type { SvgContextProps } from '../types'
import type { ReactNode } from 'react'

const Context = createContext<SvgContextProps>({})

export const SvgProvider = ({
  editProps,
  animationProps,
  children,
}: SvgContextProps & {
  children: ReactNode
}) => (
  <Context.Provider value={{ editProps, animationProps }}>
    {children}
  </Context.Provider>
)

export const useSvgContext = () => useContext(Context)
