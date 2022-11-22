import React from 'react'
import SearchSvg from '../../components/SearchSvg';
import UserSearch from '../../components/UserSearch';
import Legend from '../../components/Legend';
import "./index.css"
import { useSelector } from 'react-redux';

export default function SearchView() {

  const searchIps = useSelector(state => state.searchInfo.value)

  //FIXME:如果有新数据才绘制legend
  const renderLegend = (searchIps) => {
    if (searchIps) {
      return (
        <div className='searchLegend'>
          <Legend />
        </div>
      )
    }
  }

  return (
    <div>
      <UserSearch />
      <SearchSvg />
      {renderLegend(searchIps)}
    </div>
  )
}
