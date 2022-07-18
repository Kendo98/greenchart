import React from 'react'
import styled from 'styled-components'

import { AlertTriangle, X } from 'react-feather'
import { useURLWarningToggle, useURLWarningVisible } from '../../state/user/hooks'
import { isMobile } from 'react-device-detect'

const PhishAlert = styled.div<{ isActive: any }>`
  width: 100%;
  padding: 6px 6px;
  background-color: ${({ theme }) => theme.blue1};
  color: white;
  font-size: 12px;
  justify-content: space-between;
  align-items: center;
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
`

export const StyledClose = styled(X)`
  :hover {
    cursor: pointer;
  }
`

export default function URLWarning() {
  const toggleURLWarning = useURLWarningToggle()
  const showURLWarning = useURLWarningVisible()

  return isMobile ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={14} /> Make sure the URL is
        <code style={{ padding: '4px 4px', display: 'inline', fontWeight: 'bold' }}>https://swap.metabook.finance</code>
      </div>
      <StyledClose size={14} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : window.location.hostname === 'swap.metabook.finance' ? (
    <PhishAlert isActive={showURLWarning}>
      <div style={{ display: 'flex' }}>
        <AlertTriangle style={{ marginRight: 6 }} size={14} /> Always make sure the URL is
        <code style={{ padding: '4px 4px', display: 'inline', fontWeight: 'bold' }}>https://swap.metabook.finance/</code> -
        bookmark it to be safe.
      </div>
      <StyledClose size={14} onClick={toggleURLWarning} />
    </PhishAlert>
  ) : null
}
