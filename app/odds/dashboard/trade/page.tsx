"use client";
import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useSelectedAccount } from '@/lib/data/use-account';

import { useCancelOrder } from '../../common/use-order';
import { useUserOrders } from '../../common/use-user-orders';
import { useUserPositions } from '../../common/use-user-positions';

export default function Trade() {
  const [activeTab, setActiveTab] = useState<'position' | 'open-orders'>('position');

  const { data: accountInfo } = useSelectedAccount();
  const mounted = useRef(true);

  // const { mutateAsync: closeOrder } = useCloseOrder();
  const { mutateAsync: cancelOrder, isPending: isCancellingOrder } = useCancelOrder();

  // Cleanup on unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const {
    data: positionsData,
    isLoading: isLoadingPositions,
    error: positionsError,
  } = useUserPositions();
  const positions = positionsData?.positions;

  const { data: ordersData, isLoading: isLoadingOrders, error: ordersError } = useUserOrders();
  const orders = ordersData?.orders;

  // const handleCloseOrder = async (orderId: string) => {
  //   if (!accountInfo?.sandbox_account) return;

  //   try {
  //     await closeOrder({
  //       user_id: accountInfo.sandbox_account,
  //       order_id: orderId,
  //     });
  //   } catch (err) {
  //     console.error('Close order error:', err);
  //   }
  // };

  function handleCancelOrder(orderId: string) {
    if (!accountInfo?.sandbox_account) return;

    try {
      cancelOrder({
        order_id: orderId,
      });
    } catch (err) {
      console.error('Cancel order error:', err);
    }
  }

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trade</h1>
        <p className="text-gray-600 mt-2">Track your performance</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-8">
          <button
            className={`py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'position'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('position')}
          >
            Position
          </button>
          <button
            className={`py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'open-orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('open-orders')}
          >
            Open orders
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'position' && (
        <div>
          <div className="py-3 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-6">MARKET</div>
            <div className="col-span-3">OUTCOME</div>
            <div className="col-span-2 text-right">SHARES</div>
            <div className="col-span-1 text-right">VALUE</div>
          </div>

          <div className="divide-y">
            {isLoadingPositions ? (
              <div className="py-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <div className="text-gray-500">Loading positions...</div>
              </div>
            ) : positionsError ? (
              <div className="py-8 text-center text-red-600">{positionsError?.message}</div>
            ) : (positions || []).length === 0 ? (
              <div className="py-8 text-center text-gray-500">No positions found.</div>
            ) : (
              (positions || []).map((position, index) => (
                <div
                  key={index}
                  className="py-4 grid grid-cols-12 gap-4 items-center transition-colors hover:bg-gray-100/50"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <Image
                      src={position.market.image_url}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/odds/market/${position.market.id}`}
                        className="font-medium mb-1 hover:text-[var(--color-odd-main)] block truncate"
                      >
                        {position.market.title}
                      </Link>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center gap-3">
                    <Image
                      src={position.outcome.logo}
                      alt={position.outcome.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{position.outcome.name}</span>
                  </div>

                  <div className="col-span-2 text-right">{position.shares}</div>

                  <div className="col-span-1 text-right">${position.value}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'open-orders' && (
        <div>
          <div className="py-1 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            <div className="col-span-5">MARKET</div>
            <div className="col-span-2">OUTCOME</div>
            <div className="col-span-2 text-right">SHARES</div>
            <div className="col-span-3 text-right">VALUE</div>
          </div>

          <div className="divide-y">
            {isLoadingOrders ? (
              <div className="py-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <div className="text-gray-500">Loading orders...</div>
              </div>
            ) : ordersError ? (
              <div className="py-8 text-center text-red-600">{ordersError?.message}</div>
            ) : orders?.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No open orders found.</div>
            ) : (
              (orders || []).map((order) => (
                <div
                  key={order.order_id}
                  className="py-4 grid grid-cols-12 gap-4 items-center transition-colors hover:bg-gray-100/50"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <Image
                      src={order.market.image_url}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/odds/market/${order.market.id}`}
                        className="font-medium mb-1 hover:text-[var(--color-odd-main)] block truncate"
                      >
                        {order.market.title}
                      </Link>
                      <div className="text-sm text-gray-600">
                        {order.trading_direction === 'buy' ? 'Buy' : 'Sell'} @ ${order.price}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-3">
                    <Image
                      src={order.outcome.logo}
                      alt={order.outcome.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium truncate">{order.outcome.name}</span>
                  </div>

                  <div className="col-span-2 text-right">
                    <div className="font-medium">{order.available_shares}</div>
                    <div className="text-sm text-gray-600">of {order.shares}</div>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-4">
                    <div className="text-right">
                      <div className="font-medium">${order.available_value}</div>
                      <div className="text-sm text-gray-600">of ${order.value}</div>
                    </div>
                    <button
                      onClick={() => handleCancelOrder(order.order_id)}
                      className="px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                      disabled={isCancellingOrder}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
