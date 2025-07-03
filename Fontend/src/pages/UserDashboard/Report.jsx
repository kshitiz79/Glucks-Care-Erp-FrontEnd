import React, { useState, useEffect, useContext } from 'react'
import { Link, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import BASE_URL from '../../BaseUrl/baseUrl'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import Expenses from './Expences'
import DoctorVisiting from './DoctorVisiting'

// Utility: filter data by period
const filterByPeriod = (data, dateField, period) => {
  const now = new Date()
  return data.filter(item => {
    const d = new Date(item[dateField])
    const diff = now - d
    switch (period) {
      case 'day':
        return diff <= 24 * 60 * 60 * 1000
      case 'week':
        return diff <= 7 * 24 * 60 * 60 * 1000
      case 'month':
        return diff <= 30 * 24 * 60 * 60 * 1000
      default:
        return true
    }
  })
}

// Detail view & Excel export
const ReportDetail = () => {
  const { type } = useParams()
  const { user } = useContext(AuthContext)
  const [data, setData] = useState([])
  const [period, setPeriod] = useState('month')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const endpoint =
      type === 'expenses'
        ? `${BASE_URL}/api/expenses?userId=${user.id}`
        : `${BASE_URL}/api/doctor-visits/user/${user.id}`
    fetch(endpoint)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [type, user])

  const filtered = filterByPeriod(data, 'date', period)

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, type)
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `${type}-report-${new Date().toISOString().slice(0,10)}.xlsx`
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-indigo-600 hover:underline">
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {type.replace('-', ' ')} Report
      </h1>
      <div className="flex items-center gap-4 mb-4">
        <label>Filter:</label>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="p-2 border rounded">
          <option value="day">Last 24h</option>
          <option value="week">Last 7d</option>
          <option value="month">Last 30d</option>
          <option value="all">All</option>
        </select>
        <button onClick={downloadExcel} className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Download Excel
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {(type === 'expenses'
                ? ['Date', 'Category', 'Amount', 'Description', 'Status']
                : ['Date', 'Doctor', 'Specialization', 'Notes', 'Confirmed']
              ).map(col => (
                <th key={col} className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item._id} className="border-t hover:bg-gray-50">
                {type === 'expenses' ? (
                  <>  
                    <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 capitalize">{item.category}</td>
                    <td className="px-6 py-4">₹{item.amount}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4 capitalize">{item.status}</td>
                  </>
                ) : (
                  <>  
                    <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{item.doctor?.name}</td>
                    <td className="px-6 py-4">{item.doctor?.specialization}</td>
                    <td className="px-6 py-4">{item.notes}</td>
                    <td className="px-6 py-4">{item.confirmed ? 'Yes' : 'No'}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Report = () => {
  return (
    <Routes>
      {/* Dashboard cards */}
      <Route
        path="/"
        element={
          <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link to="expenses" className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <span className="text-4xl text-indigo-600">📊</span>
                  <div>
                    <h3 className="text-xl font-semibold">Expense Report</h3>
                    <p className="text-gray-600">View & download expense data</p>
                  </div>
                </div>
              </Link>
              <Link to="doctor-visits" className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <span className="text-4xl text-green-600">🩺</span>
                  <div>
                    <h3 className="text-xl font-semibold">Doctor Visit Report</h3>
                    <p className="text-gray-600">View & download visit data</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        }
      />
      <Route path=":type" element={<ReportDetail />} />
    </Routes>
  )
}

export default Report
