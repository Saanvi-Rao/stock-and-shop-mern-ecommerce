import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  return (
    <div className='container mx-auto px-4 py-6'>
      {/* Header */}
      <div className='bg-white shadow-md p-3 text-center text-2xl font-semibold mb-5 text-green-800 uppercase tracking-widest rounded-2xl'>
        <h1>MY ORDERS</h1>
      </div>

      {/* No Orders */}
      {!orders[0] && <NoData />}

      {/* Orders Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {orders.map((order, index) => (
          <div
            key={order._id + index + "order"}
            className='bg-white rounded-2xl shadow-lg p-4 flex flex-col transition-all duration-200 border border-black hover:shadow-xl'
          >
            <p className='font-semibold text-neutral-800 mb-2'>Order No: {order?.orderId}</p>

            <div className='flex gap-4 items-center'>
              <img
                src={order.product_details.image[0]}
                alt={order.product_details.name}
                className='w-20 h-20 object-cover rounded-lg'
              />
              <p className='font-semibold text-neutral-800'>{order.product_details.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
