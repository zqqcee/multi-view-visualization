import React from 'react'
import SearchSvg from '../../components/SearchSvg';
import UserSearch from '../../components/UserSearch';
import Legend from '../../components/Legend';
import "./index.css"
import { useSelector } from 'react-redux';
import SearchDetail from '../../components/SearchDetail';

export default function SearchView() {

  const searchIps = useSelector(state => state.searchInfo.value)

  //FIXME:如果有新数据才绘制legend
  const renderLegend = (searchIps) => {
    if (searchIps) {
      return (
        <div className='searchLegend' style={{ top: ' 32px' }}>
          <Legend />
        </div>
      )
    }
  }

  const renderDetail = () => {
    if (searchIps) {
      console.log();
      return (
        <div className='searchdetail'>
          <SearchDetail />
        </div>
      )
    }
  }

  return (
    <div>
      <UserSearch />
      {renderDetail()}
      <SearchSvg />
      {renderLegend(searchIps)}
    </div>
  )
}
