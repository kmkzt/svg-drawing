import React, { createContext, useContext } from 'react'
import type { EditProps } from '../types'
import type { ReactNode } from 'react'

const Context = createContext<{ editProps?: EditProps }>({})

export const SvgProvider = ({
  editProps,
  children,
}: {
  editProps?: EditProps
  children: ReactNode
}) => <Context.Provider value={{ editProps }}>{children}</Context.Provider>

export const useSvgContext = () => useContext(Context)
