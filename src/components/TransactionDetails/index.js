import React, { useState } from 'react'
import ReactGA from 'react-ga'
import { useTranslation } from 'react-i18next'
import styled, { css, keyframes } from 'styled-components'
import { darken, lighten } from 'polished'
import { amountFormatter } from '../../utils'
import { useDebounce } from '../../hooks'

import question from '../../assets/images/question.svg'

import NewContextualInfo from '../../components/ContextualInfoNew'

const Flex = styled.div`
  display: flex;
  justify-content: center;
  button {
    max-width: 20rem;
  }
`

const SlippageRow = styled(Flex)`
  position: relative;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  padding: 0;
  height: 24px;
  margin-bottom: 14px;
`

const QuestionWrapper = styled.div`
  margin-left: 0.4rem;
  margin-top: 0.2rem;

  &:hover {
    cursor: pointer;
  }
`

const Popup = styled(Flex)`
  position: absolute;
  width: 228px;
  left: -78px;
  top: -124px;

  flex-direction: column;
  aligm-items: center;

  padding: 1rem;

  line-height: 183.52%;
  background: #404040;
  border-radius: 8px;

  color: white;
  font-style: italic;
`

const Option = styled(FancyButton)`
  margin-right: 8px;
  margin-top: 6px;

  :hover {
    cursor: pointer;
  }

  ${({ active, theme }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.royalBlue};
      color: ${({ theme }) => theme.white};
      border: none;

      :hover {
        border: none;
        box-shadow: none;
        background-color: ${({ theme }) => darken(0.05, theme.royalBlue)};
      }

      :focus {
        border: none;
        box-shadow: none;
        background-color: ${({ theme }) => lighten(0.05, theme.royalBlue)};
      }

      :active {
        background-color: ${({ theme }) => darken(0.05, theme.royalBlue)};
      }

      :hover:focus {
        background-color: ${({ theme }) => theme.royalBlue};
      }
      :hover:focus:active {
        background-color: ${({ theme }) => darken(0.05, theme.royalBlue)};
      }
    `}
`
    

const Input = styled.input`
  width: 123.27px;
  background: #ffffff;
  height: 2rem;
  outline: none;
  margin-left: 20px;
  border: 1px solid #f2f2f2;
  box-sizing: border-box;
  border-radius: 36px;
  color: #aeaeae;

  &:focus {
  }

  text-align: left;
  padding-left: 0.9rem;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ${({ active }) =>
    active &&
    `
    border: 1px solid #2f80ed;
    text-align: right;
    padding-right 1.5rem;
    padding-left 0rem;
    color : inherit;
  `}

  ${({ warning }) =>
    warning === 'red' &&
    `
    color : #FF6871;
    border: 1px solid #FF6871;
  `}
`

const BottomError = styled.div`
  margin-top: 1rem;
  color: #aeaeae;

  ${({ color }) =>
    color === 'red' &&
    `
    color : #FF6871;
  `}
`

const OptionCustom = styled(FancyButton)`
  height: 2rem;
  position: relative;
  width: 120px;
  margin-top: 6px;
  padding: 0 0.75rem;

  ${({ active }) =>
    active &&
    css`
      border: 1px solid ${({ theme }) => theme.royalBlue};
      :hover {
        border: 1px solid ${({ theme }) => darken(0.1, theme.royalBlue)};
      }
    `}

const OptionLarge = styled(Option)`
  width: 120px;
`

const Bold = styled.span`
  font-weight: 500;
`

const LastSummaryText = styled.div`
  padding-top: 0.5rem;
`

const SlippageSelector = styled.div`
  margin-top: 1rem;
`

const InputGroup = styled.div`
  position: relative;
`

const Percent = styled.div`
  right: 14px;
  top: 9px;
  position: absolute;
  color: inherit;
  font-size: 0, 8rem;

  ${({ color }) =>
    (color === 'faded' &&
      `
    color : #AEAEAE
    `) ||
    (color === 'red' &&
      `
    color : #FF6871
    `)}
`

const Faded = styled.span`
  opacity: 0.7;
`

const ErrorEmoji = styled.span`
  left: 30px;
  top: 4px;
  position: absolute;
`

const ValueWrapper = styled.span`
  padding: 0.125rem 0.3rem 0.1rem 0.3rem;
  background-color: ${({ theme }) => darken(0.04, theme.concreteGray)};
  border-radius: 12px;
  font-variant: tabular-nums;
  vertical
`

export default function TransactionDetails(props) {
  const { t } = useTranslation()

  function renderSummary() {
    let contextualInfo = ''
    let isError = false

    if (props.inputError || props.independentError) {
      contextualInfo = props.inputError || props.independentError
      isError = true
    } else if (!props.inputCurrency || !props.outputCurrency) {
      contextualInfo = t('selectTokenCont')
    } else if (!props.independentValue) {
      contextualInfo = t('enterValueCont')
    } else if (props.sending && !props.recipientAddress) {
      contextualInfo = t('noRecipient')
    } else if (props.sending && !isAddress(props.recipientAddress)) {
      contextualInfo = t('invalidRecipient')
    } else if (!props.account) {
      contextualInfo = t('noWallet')
      isError = true
    }

    const slippageWarningText = props.highSlippageWarning
      ? t('highSlippageWarning')
      : props.slippageWarning
      ? t('slippageWarning')
      : ''

    return (
      <NewContextualInfo
        openDetailsText={t('transactionDetails')}
        closeDetailsText={t('hideDetails')}
        contextualInfo={contextualInfo ? contextualInfo : slippageWarningText}
        allowExpand={
          !!(
            props.inputCurrency &&
            props.outputCurrency &&
            props.inputValueParsed &&
            props.outputValueParsed &&
            (props.sending ? props.recipientAddress : true)
          )
        }
        isError={isError}
        slippageWarning={props.slippageWarning && !contextualInfo}
        highSlippageWarning={props.highSlippageWarning && !contextualInfo}
        renderTransactionDetails={renderTransactionDetails}
        dropDownContent={dropDownContent}
      />
    )
  }

  const [activeIndex, setActiveIndex] = useState(3)

  const [placeHolder, setplaceHolder] = useState('Custom')

  const [warningType, setWarningType] = useState('none')

  const [showPopup, setPopup] = useState(false)

  const dropDownContent = () => {
    return (
      <>
        {renderTransactionDetails()}
        <Break />
        <SlippageSelector>
          <SlippageRow>
            Limit addtional price slippage
            <QuestionWrapper
              onMouseEnter={() => {
                setPopup(true)
              }}
              onMouseLeave={() => {
                setPopup(false)
              }}
            >
              <img src={questionMark} alt="question mark" />
            </QuestionWrapper>
            {showPopup ? (
              <Popup>
                Lowering this limit decreases your risk of frontrunning. This makes it more likely that your transaction
                will fail due to normal price movements.
              </Popup>
            ) : (
              ''
            )}
          </SlippageRow>
          <SlippageRow>
            <Option
              onClick={() => {
                updateSlippage(0.1)
                setWarningType('none')
                setActiveIndex(1)
                props.setcustomSlippageError('valid')
                setplaceHolder('Custom')
              }}
              active={activeIndex === 1 ? true : false}
            >
              0.1%
            </Option>
            <Option
              onClick={() => {
                updateSlippage(1)
                setWarningType('none')
                setActiveIndex(2)
                props.setcustomSlippageError('valid')
                setplaceHolder('Custom')
              }}
              active={activeIndex === 2 ? true : false}
            >
              1%
            </Option>
            <OptionLarge
              onClick={() => {
                updateSlippage(2)
                setWarningType('none')
                setActiveIndex(3)
                props.setcustomSlippageError('valid')
                setplaceHolder('Custom')
              }}
              active={activeIndex === 3 ? true : false}
            >
              2%
              <Faded>(suggested)</Faded>
            </OptionLarge>
            <InputGroup>
              {warningType !== 'none' ? <ErrorEmoji>⚠️</ErrorEmoji> : ''}
              <Input
                placeholder={placeHolder}
                value={userInput || ''}
                onChange={parseInput}
                onClick={e => {
                  setActiveIndex(4)
                  setplaceHolder('')
                  parseInput(e)
                }}
                active={activeIndex === 4 ? true : false}
                warning={
                  warningType === 'emptyInput'
                    ? ''
                    : warningType !== 'none' && warningType !== 'riskyEntryLow'
                    ? 'red'
                    : ''
                }
              />
              <Percent
                color={
                  warningType === 'emptyInput'
                    ? 'faded'
                    : warningType !== 'none' && warningType !== 'riskyEntryLow'
                    ? 'red'
                    : activeIndex !== 4
                    ? 'faded'
                    : ''
                }
              >
                %
              </Percent>
            </InputGroup>
          </SlippageRow>
          <SlippageRow>
            <BottomError
              color={
                warningType === 'emptyInput'
                  ? ''
                  : warningType !== 'none' && warningType !== 'riskyEntryLow'
                  ? 'red'
                  : ''
              }
            >
              {warningType === 'emptyInput' ? 'Enter a slippage percentage.' : ''}
              {warningType === 'invalidEntry' ? 'Please input a valid percentage.' : ''}
              {warningType === 'invalidEntryBound' ? 'Pleae select value less than 50%' : ''}
              {warningType === 'riskyEntryHigh' ? 'Your transaction may be frontrun.' : ''}
              {warningType === 'riskyEntryLow' ? 'Your transaction may fail.' : ''}
            </BottomError>
          </SlippageRow>
        </SlippageSelector>
      </>
    )
  }

  const [userInput, setUserInput] = useState()

  const parseInput = e => {
    let input = e.target.value
    if (input === '') {
      setUserInput(input)
      props.setcustomSlippageError('invalid')
      return setWarningType('emptyInput')
    }
    //check for decimal
    let isValid = /^[+]?\d*\.?\d{1,2}$/.test(input) || /^[+]?\d*\.$/.test(input)
    let decimalLimit = /^\d+\.?\d{0,2}$/.test(input) || input === ''
    if (decimalLimit) {
      setUserInput(input)
    } else {
      return
    }
    if (isValid) {
      checkAcceptablePercentValue(input)
    } else {
      setWarningType('invalidEntry')
    }
  }

  const checkAcceptablePercentValue = input => {
    setTimeout(function() {
      setWarningType('none')
      props.setcustomSlippageError('valid')
      if (input < 0 || input > 50) {
        props.setcustomSlippageError('invalid')
        return setWarningType('invalidEntryBound')
      }
      if (input >= 0 && input < 0.1) {
        props.setcustomSlippageError('valid')
        setWarningType('riskyEntryLow')
      }
      if (input >= 5) {
        props.setcustomSlippageError('warning')
        setWarningType('riskyEntryHigh')
      }
      updateSlippage(input)
    }, 300)
  }

  const updateSlippage = newSlippage => {
    let numParsed = parseFloat((newSlippage * 100).toFixed(2))
    props.setRawSlippage(numParsed)
    props.setRawTokenSlippage(numParsed)
  }

  const b = text => <Bold>{text}</Bold>

  const renderTransactionDetails = () => {
    ReactGA.event({
      category: 'TransactionDetail',
      action: 'Open'
    })

    if (props.independentField === props.INPUT) {
      return props.sending ? (
        <div>
          <div>
            {t('youAreSelling')}{' '}
            {b(
              `${amountFormatter(
                props.independentValueParsed,
                props.independentDecimals,
                Math.min(4, props.independentDecimals)
              )} ${props.inputSymbol}`
            )}
            .
          </div>
          <LastSummaryText>
            {b(props.recipientAddress)} {t('willReceive')}{' '}
            {b(
              `${amountFormatter(
                props.dependentValueMinumum,
                props.dependentDecimals,
                Math.min(4, props.dependentDecimals)
              )} ${props.outputSymbol}`
            )}{' '}
          </LastSummaryText>
          <LastSummaryText>
            {t('priceChange')} {b(`${props.percentSlippageFormatted}%`)}.
          </LastSummaryText>
        </div>
      ) : (
        <div>
          <div>
            {t('youAreSelling')}{' '}
            <ValueWrapper>
              {b(
                `${amountFormatter(
                  props.independentValueParsed,
                  props.independentDecimals,
                  Math.min(4, props.independentDecimals)
                )} ${props.inputSymbol}`
              )}
            </ValueWrapper>{' '}
            {t('forAtLeast')}{' '}
            <ValueWrapper>
              {b(
                `${amountFormatter(
                  props.dependentValueMinumum,
                  props.dependentDecimals,
                  Math.min(4, props.dependentDecimals)
                )} ${props.outputSymbol}`
              )}
            </ValueWrapper>
            .
          </div>
          <LastSummaryText>
            {t('priceChange')} <ValueWrapper>{b(`${props.percentSlippageFormatted}%`)}</ValueWrapper>
          </LastSummaryText>
        </div>
      )
    } else {
      return props.sending ? (
        <div>
          <div>
            {t('youAreSending')}{' '}
            {b(
              `${amountFormatter(
                props.independentValueParsed,
                props.independentDecimals,
                Math.min(4, props.independentDecimals)
              )} ${props.outputSymbol}`
            )}{' '}
            {t('to')} {b(props.recipientAddress)}.
          </div>
          <LastSummaryText>
            {t('itWillCost')}{' '}
            {b(
              `${amountFormatter(
                props.dependentValueMaximum,
                props.dependentDecimals,
                Math.min(4, props.dependentDecimals)
              )} ${props.inputSymbol}`
            )}{' '}
          </LastSummaryText>
          <LastSummaryText>
            {t('priceChange')} {b(`${props.percentSlippageFormatted}%`)}.
          </LastSummaryText>
        </div>
      ) : (
        <div>
          <div>
            {t('youAreBuying')}{' '}
            <ValueWrapper>
              {b(
                `${amountFormatter(
                  props.independentValueParsed,
                  props.independentDecimals,
                  Math.min(4, props.independentDecimals)
                )} ${props.outputSymbol}`
              )}
            </ValueWrapper>
            .
          </div>
          <LastSummaryText>
            {t('itWillCost')}{' '}
            {b(
              `${amountFormatter(
                props.dependentValueMaximum,
                props.dependentDecimals,
                Math.min(4, props.dependentDecimals)
              )} ${props.inputSymbol}`
            )}{' '}
          </LastSummaryText>
          <LastSummaryText>
            {t('priceChange')} <ValueWrapper>{b(`${props.percentSlippageFormatted}%`)}</ValueWrapper>
          </LastSummaryText>
        </div>
      )
    }
  }
  return <>{renderSummary()}</>
}
