import React, { useLayoutEffect, useState } from 'react'
import { createFilter } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { MenuList } from '../../data-browser/datasets/MenuList'
import { createLEIOption, itemStyleFn, makeItemPlaceholder, sortByLabel } from '../../data-browser/datasets/selectUtils'
import { useRemoteJSON } from '../../common/useRemoteJSON'

let lastTimeout = null

/** Construct the placeholder text for the Select box based on loading status and availability of options  */
function itemPlaceholder(loading, hasItems, category, selectedValue) {
  if(loading) return 'Loading...'
  if (!hasItems || category === 'leis') return `Type to select an Institution`
  const placeholder = makeItemPlaceholder(category, [selectedValue])
  return placeholder
}

/** Create a map of Filers (Institution Name, LEI) by LEI for efficient access */
function createLeiMap(json) {
  if (!json) return {}

  return json.institutions.reduce((memo, curr) => {
    memo[curr.lei.toUpperCase()] = { ...curr, name: curr.name.toUpperCase() }
    return memo
  }, {})
}

/** Style adjustments for react-select components */
const styleFn = {
  ...itemStyleFn,
  container: p => ({ ...p, width: '100%' }),
  control: p => ({ ...p, borderRadius: '4px' })
}

/** Display feedback regarding user inputs */
const ValidationStatus = ({ items }) => {
  if (!items || !items.length) return null
  const {type, text} = items[0]
  return (
    <div id='validation' className={type}>
      {text}
    </div>
  )
}

/** Search box for easier selection of Institutions using the /filers/{year} endpoint to generate options */
export const FilersSearchBox = ({ endpoint, onChange, year, ...rest }) => {
  const [selectedValue, setSelectedValue] = useState(null)
  const [isInitial, setIsInitial] = useState(true)
  const [validationMsgs, setValidationMsgs] = useState([])

  const [data, isFetching, error] = useRemoteJSON(
    endpoint || `https://ffiec.cfpb.gov/v2/reporting/filers/${year}`,
    { transformReceive: createLeiMap, forceFetch: true }
  )

  // Enable type-to-search on pageload by focusing the LEI input element
  useLayoutEffect(() => {
    if (!isFetching && data)
      lastTimeout = setTimeout(() => document.querySelector('#lei-select input').focus(), 100)
    return () => lastTimeout && clearTimeout(lastTimeout)
  }, [data, isFetching])


  // Trigger callback with a faux Event containing the Institution info for the selected LEI
  const handleSelection = args => {
    const item = args
    const itemValue = item ? item.value : ''
    setIsInitial(false)
    setSelectedValue(item)
    onChange({
      target: { id: 'lei', value: itemValue },
      preventDefault: () => null,
    })
  }

  // Generate and sort options, asc by Institution name
  const options = data
    ? Object.keys(data)
        .map((d) => createLEIOption(d, data))
        .sort(sortByLabel)
    : []

  // Validation and sanitization of user input
  const onInputChange = (text) => {
    if (!text) return setValidationMsgs(null)
    const cleanUpperCased = text.toUpperCase().replace(/[^\sA-Z0-9+]+/gi, '')
    const cleanNoSpace = cleanUpperCased.replace(/\s/gi, '')
    const lengthCheck = cleanNoSpace.length
    if (lengthCheck < 20 && cleanNoSpace.match(/[0-9]$/)) // Could be an LEI but it's too short
      setValidationMsgs([{ type: 'error', text: 'LEI must be 20 characters' }])
    else if (lengthCheck === 20) // If you're trying to enter an LEI, this is a correctly formatted LEI
      setValidationMsgs([{ type: 'success', text: 'LEI (20 characters)' }])
    else if (lengthCheck > 20)  // You're probably searching for an Institution name, but if you were trying to enter an LEI...
      setValidationMsgs([{ type: 'status', text: `Not an LEI: ${lengthCheck} characters` }])
    else
      setValidationMsgs(null)
    return cleanUpperCased
  }


  return (
    <>
      <ValidationStatus items={validationMsgs} />
      <CreatableSelect
        id='lei-select'
        autoFocus
        openOnFocus
        searchable
        simpleValue
        controlShouldRenderValue
        value={selectedValue}
        options={options}
        onChange={handleSelection}
        onInputChange={onInputChange}
        placeholder={itemPlaceholder( isFetching, options.length, 'leis', selectedValue )}
        components={{ MenuList }}
        filterOption={createFilter({ ignoreAccents: false })}
        styles={styleFn}
        menuIsOpen={!isFetching && (isInitial || !selectedValue || undefined)}
        isDisabled={isFetching}
      />
    </>
  )
}


export default FilersSearchBox;