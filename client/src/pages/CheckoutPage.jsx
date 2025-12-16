import React, { useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddAddress from '../components/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {

  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector(state => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector(state => state.cartItem.cart);
  const navigate = useNavigate();

  // ---------------------------------
  // ONLINE PAYMENT (STRIPE REDIRECT)
  // ---------------------------------
  const handleOnlinePayment = async () => {
    try {
      if (cartItemsList.length === 0)
        return toast.error("Your cart is empty.");

      if (!addressList[selectAddress]?._id)
        return toast.error("Please select a delivery address.");

      const response = await Axios({
        ...SummaryApi.payment,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      });

      console.log("Payment Response:", response.data);

      if (response.data?.success && response.data?.url) {
        window.location.href = response.data.url; // STRIPE REDIRECT
      } else {
        toast.error("Stripe did not return a valid redirect URL.");
      }

    } catch (err) {
      AxiosToastError(err);
    }
  };

  // ---------------------------------
  // CASH ON DELIVERY
  // ---------------------------------
  const handleCashOnDelivery = async () => {
    try {
      if (cartItemsList.length === 0)
        return toast.error("Your cart is empty.");

      if (!addressList[selectAddress]?._id)
        return toast.error("Please select a delivery address.");

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCartItem();
        fetchOrder();
        navigate("/success", { state: { text: "Order" } });
      }

    } catch (err) {
      AxiosToastError(err);
    }
  };

  return (
    <section className="bg-[#f7f7f7] min-h-screen">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">

        {/* ADDRESS LIST */}
        <div className="w-full bg-white py-4 px-3 rounded-md border border-black">

          <h3 className="text-center text-2xl font-semibold mb-5 text-green-800 uppercase">
            Choose Your Address
          </h3>

          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => (
              <label key={index} htmlFor={"address" + index} className={!address.status && "hidden"}>
                <div className="border rounded p-3 flex gap-3 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition">
                  <input
                    id={"address" + index}
                    type="radio"
                    value={index}
                    checked={Number(selectAddress) === index}
                    onChange={(e) => setSelectAddress(e.target.value)}
                    name="address"
                  />
                  <div className="font-semibold">
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.country} - {address.pincode}</p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}

            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-green-200 border-2 border-dashed flex justify-center items-center cursor-pointer hover:bg-green-300 text-green-800 font-semibold rounded-xl"
            >
              Add address
            </div>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div className="w-full max-w-md bg-white py-4 px-3 rounded-md border border-black self-start">

          <h3 className="text-center text-2xl font-semibold text-green-800 uppercase mb-4">
            Summary
          </h3>

          <div className="bg-white p-4">
            <div className="flex justify-between"><p>Items total</p><p>{DisplayPriceInRupees(totalPrice)}</p></div>
            <div className="flex justify-between"><p>Quantity total</p><p>{totalQty} item</p></div>
            <div className="flex justify-between"><p>Delivery Charge</p><p>Free</p></div>
            <div className="font-semibold flex justify-between"><p>Grand total</p><p>{DisplayPriceInRupees(totalPrice)}</p></div>
          </div>

          <div className="w-full flex flex-col gap-4 mt-4">
            <button
              onClick={handleOnlinePayment}
              className="py-2 px-4 border-2 border-green-600 text-green-800 font-semibold hover:bg-green-600 hover:text-white rounded"
            >
              Online Payment
            </button>

            <button
              onClick={handleCashOnDelivery}
              className="py-2 px-4 border-2 border-green-600 text-green-800 font-semibold hover:bg-green-600 hover:text-white rounded"
            >
              Cash on Delivery
            </button>
          </div>

        </div>

      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
