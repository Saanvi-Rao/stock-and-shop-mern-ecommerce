import React from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const DisplayTable = ({ data, column }) => {
  const table = useReactTable({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2 sm:p-4">
      {/* MOBILE ONLY SCROLL */}
      <div className="border border-gray-200 shadow-md rounded-lg overflow-x-auto sm:overflow-x-visible">
        <table className="w-full min-w-[600px] border-collapse text-sm table-auto">
          {/* Header */}
          <thead className="bg-green-200 text-gray-800 uppercase text-sm font-serif">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {/* Sr.No */}
                <th className="px-4 py-3 text-center font-bold border-b border-gray-200">
                  Sr.No
                </th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-4 py-3 font-bold border-b border-gray-200 whitespace-nowrap ${
                      header.column.columnDef.meta?.className || 'text-center'
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody className="text-gray-700">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 even:bg-gray-50 transition-colors"
              >
                {/* Sr.No */}
                <td className="px-4 py-3 border-b border-gray-200 text-center font-semibold text-gray-900">
                  {index + 1}
                </td>

                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 border-b border-gray-200 whitespace-nowrap break-words ${
                      cell.column.columnDef.meta?.className || 'text-center'
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DisplayTable
