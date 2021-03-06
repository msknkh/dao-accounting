/* eslint-disable */
import { useEffect, useState, useContext } from 'react'

import {
  CButton,
  CListGroup,
  CListGroupItem,
  CFormSelect,
  CContainer,
  CRow,
  CCol,
  CFormInput, 
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody
} from '@coreui/react'

import CreatableSelect from 'react-select/creatable';
import AddressContext from 'src/context';


import CIcon from '@coreui/icons-react'
import {
  cifUs,
  cilPeople,
} from '@coreui/icons'

import processedData from 'src/reprocessed-0x8c3fa50473065f1d90f186ca8ba1aa76aee409bb.json'
import TxTable from 'src/components/TxTable'

import crossIcon from 'src/assets/navBarIcons/untagged-tx-black.png'
import Select from 'react-select/creatable';

import { 
  aggregateInOut,
  getQuarterlyData,
  getYearlyData,
  getFormattedIncomeUSDData,
  getFormattedExpenseUSDData,
  getFormattedIncomeUSDDataLivePrices,
  getFormattedExpenseUSDDataLivePrices,
  mergeDatasets,
} from 'src/views/summary/Summary.util.js'

import { mergeCoinsData } from 'src/views/pnl/PnL.util.js'

import {
  filterByTag,
  filterByTxType,
} from 'src/views/alltxspage/AllTxsPage.utils.js'

const PnL = () => {
  const {address, setAddress} = useContext(AddressContext);
  const [txData, setTxData] = useState({})
  const [coins, setCoins] = useState(['USDC', 'ETH', 'USDT', 'UNI', 'MANA', 'WBTC', 'BAT', 'DAI'])
  const [timeDuration, setTimeDuration] = useState('1M')
  const [incomeTags, setIncomeTags] = useState(['ERC20', 'native'])
  const [expenseTags, setExpenseTags] = useState([])
  const [incomeObject, setIncomeObject] = useState({
    incomeTxs: [],
    monthlyIncomeData: [],
    incomeTableData: [],
  })
  const [expenseObject, setExpenseObject] = useState({
    expenseTxs: [],
    monthlyExpenseData: [],
    expenseTableData: [],
  })

  const [incomeTagsObj, setIncomeTagsObj] = useState([])
  const [expenseTagsObj, setExpenseTagsObj] = useState([])

  const txToObject = (data, tag) => {
    let txs = (data)
    if (tag) {txs = filterByTag(tag, data)}
    let monthlyData = []
    if(timeDuration === '1M'){
      monthlyData = aggregateInOut(txs, address)
    }
    else if (timeDuration === '1Q'){
      monthlyData = getQuarterlyData(aggregateInOut(txs, address))
    }
    else{
      monthlyData = getYearlyData(aggregateInOut(txs, address))
    }

    const tableData = mergeCoinsData(monthlyData)

    return [txs, monthlyData, tableData]
  }

  useEffect(() => {
    const [incomeTxs, monthlyIncomeData, incomeTableData] = txToObject(processedData)
    
    const incomeObj = {}
    incomeObj['incomeTxs'] = incomeTxs
    incomeObj['monthlyIncomeData'] = monthlyIncomeData
    incomeObj['incomeTableData'] = incomeTableData
    
    setIncomeObject(prevState => incomeObj)

    for (let tag of incomeTags){
      const [incomeTxs, monthlyIncomeData, incomeTableData] = txToObject(processedData, tag)
    
      const incomeObj = {}
      incomeObj['incomeTxs'] = incomeTxs
      incomeObj['monthlyIncomeData'] = monthlyIncomeData
      incomeObj['incomeTableData'] = incomeTableData
      
      console.log(tag, incomeObj)
      setIncomeTagsObj(prevState => [...prevState, incomeObj])
    }


    const [expenseTxs, monthlyExpenseData, expenseTableData] = txToObject(processedData)
    
    const expenseObj = {}
    expenseObj['expenseTxs'] = expenseTxs
    expenseObj['monthlyExpenseData'] = monthlyExpenseData
    expenseObj['expenseTableData'] = expenseTableData

    setExpenseObject(prevState => expenseObj)

    for (let tag of expenseTags){
      const [expenseTxs, monthlyExpenseData, expenseTableData] = txToObject(processedData, tag)
    
    const expenseObj = {}
    expenseObj['expenseTxs'] = expenseTxs
    expenseObj['monthlyExpenseData'] = monthlyExpenseData
    expenseObj['expenseTableData'] = expenseTableData

    setExpenseTagsObj(prevState => [...prevState, expenseObj])
    }
  }, [])

  const getColor = (name) => {
    let colors = ['#28456c', '#89632a', '#69314c', '#373737', '#603b2c', '#854c1d', '#492f64', '#2b593f', '#6e3630', '#5a5a5a'];
    let x = 0;
    for (let c of name) 
        x += (c.charCodeAt(0));

    return colors[x%colors.length];
  }

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  return (
    <div>
      <CContainer style={{marginBottom: '15px'}}>
        <CRow >
            <CCol sm="3">
              <button style={{borderColor: 'transparent'}} >
                <div>
                  <img className='tx-coin-img tilt-45' src={crossIcon} alt={'Add'} />
                  Add Income Tags
                </div>
              </button>
            </CCol>

            <CCol sm="5">
              <Select
                placeholder="Select Tag"
                aria-label="Default select example"
                options={[
                  { value: 'Income', label: <div>Income</div> },
                  { value: 'Grant', label: <div>Grant</div> },
                  { value: 'NFT', label: <div>NFT Sales</div> },
                  { value: 'Airdrop', label: <div>Airdrop</div> },
                  { value: 'Mint', label: <div>Mint</div> },
                ]}
                name="NewCoinTransfer"
                required
              />
            </CCol>
        </CRow>
      </CContainer>

      <h3>Income Statement</h3>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {
              (['', ...(Object.keys(incomeObject.incomeTableData))]).map((timeStr, index) => {
                return (<CTableHeaderCell key={index} sm='auto'>{timeStr}</CTableHeaderCell>)
              })
            }
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            {
              (['', ...(Object.keys(incomeObject.incomeTableData))]).map((timeStr, index) => {
                if (timeStr === '') {
                  return <CTableDataCell key={index}>Income</CTableDataCell> 
                } else {
                  return (<CTableDataCell key={index}>{numberWithCommas(incomeObject.incomeTableData[timeStr].income.usdAmount.toFixed(2))}</CTableDataCell>)
                }
              })
            }
          </CTableRow>
          <CTableRow>
            <CTableDataCell>
              <div 
                className='tag-in-table'
                style={{backgroundColor: getColor('ERC20')}}
              >
                ERC20
              </div>
            </CTableDataCell>
            <CTableDataCell>80,016.00</CTableDataCell>
            <CTableDataCell>225,615.12</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
            <CTableDataCell>375,601.22</CTableDataCell>
            <CTableDataCell>5.00</CTableDataCell>
            <CTableDataCell>11,721.83</CTableDataCell>
            <CTableDataCell>33.00</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
            <CTableDataCell>3,004,002.49</CTableDataCell>
            <CTableDataCell>2,000,400.02</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell>
              <div 
                className='tag-in-table'
                style={{backgroundColor: getColor('native')}}
              >
                native
              </div>
            </CTableDataCell>
            <CTableDataCell>2.60</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
            <CTableDataCell>10,565.42</CTableDataCell>
            <CTableDataCell>89.50</CTableDataCell>
            <CTableDataCell>7,931.19</CTableDataCell>
            <CTableDataCell>41.39</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
            <CTableDataCell>0.00</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      
      <CContainer style={{marginTop: '30px', marginBottom: '15px'}}>
        <CRow >
            <CCol sm="3">
              <button style={{borderColor: 'transparent'}} 
              // onClick={handleNewRowSubmit}
              >
                <div>
                  <img className='tx-coin-img tilt-45' src={crossIcon} alt={'Add'} />
                  Add Expense Tags
                </div>
              </button>
            </CCol>

            <CCol sm="5">
              <Select
                placeholder="Select Tag"
                aria-label="Default select example"
                options={[
                  { value: 'Expense', label: <div>Income</div> },
                  { value: 'Burn', label: <div>Grant</div> },
                  { value: 'NFT', label: <div>NFT Sales</div> },
                  { value: 'Airdrop', label: <div>Airdrop</div> },
                ]}
                name="NewCoinTransfer"
                required
                // onChange={handleNewPaymentCoin}
              />
            </CCol>
        </CRow>
      </CContainer>
      <h3>Expense Statement</h3>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {
              (['', ...(Object.keys(expenseObject.expenseTableData))]).map((timeStr, index) => {
                return (<CTableHeaderCell key={index} sm='auto'>{timeStr}</CTableHeaderCell>)
              })
            }
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
          {
            (['', ...(Object.keys(expenseObject.expenseTableData))]).map((timeStr, index) => {
              if (timeStr === '') {
                return <CTableDataCell key={index}>Expense</CTableDataCell> 
              } else {
                return (<CTableDataCell key={index}>{numberWithCommas(expenseObject.expenseTableData[timeStr].expense.usdAmount.toFixed(2))}</CTableDataCell>)
              }
            })
          }
          </CTableRow>
          
        </CTableBody>
      </CTable>

      <h3>Cashflow Statement</h3>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {
              (['', ...(Object.keys(expenseObject.expenseTableData))]).map((timeStr, index) => {
                return (<CTableHeaderCell key={index} sm='auto'>{timeStr}</CTableHeaderCell>)
              })
            }
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
          {
            (['', ...(Object.keys(expenseObject.expenseTableData))]).map((timeStr, index) => {
              if (timeStr === '') {
                return <CTableDataCell key={index}>Cashflow</CTableDataCell> 
              } else {
                return (<CTableDataCell key={index}>{numberWithCommas((incomeObject.incomeTableData[timeStr].income.usdAmount - expenseObject.expenseTableData[timeStr].expense.usdAmount).toFixed(2))}</CTableDataCell>)
              }
            })
          }
          </CTableRow>
          
        </CTableBody>
      </CTable>
    </div>
  );
}

export default PnL