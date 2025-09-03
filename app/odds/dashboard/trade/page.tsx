'use client';

import React, { useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useCancelOrder } from '../../common/use-order';
import { useOddsUserInfo } from '../../common/use-user-info';
import { useUserOrders } from '../../common/use-user-orders';
import { useUserPositions } from '../../common/use-user-positions';

export default function Trade() {
  const [activeTab, setActiveTab] = useState<'position' | 'open-orders'>('position');

  const {
    data: positionsData,
    isLoading: isLoadingPositions,
    error: positionsError,
  } = useUserPositions();

  const positions = positionsData?.positions;

  const { data: ordersData, isLoading: isLoadingOrders, error: ordersError } = useUserOrders();

  const [hasCancelOrderId, setHasCancelOrderId] = useState<string[]>([]);

  const orders = useMemo(() => {
    return ordersData?.orders.filter((order) => !hasCancelOrderId.includes(order.order_id));
  }, [hasCancelOrderId, ordersData]);

  function handleCancelOrderSuccess(orderId: string) {
    setHasCancelOrderId((prev) => [...prev, orderId]);
  }

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex md:flex-row flex-col md:items-center items-start md:gap-3 gap-0 leading-[140%]">
          <span className="text-xl font-medium text-[#131E40]">Trade</span>
          <span className="text-[#A5ADC6] font-normal text-sm mt-[6px]">
            Track your performance
          </span>
        </div>

        <div className="flex gap-3">
          <button
            className={`font-medium text-sm h-8 flex items-center px-[10px] rounded-[8px] transition-colors ${
              activeTab === 'position'
                ? 'bg-[#FAFAFA] text-[#131E40]'
                : 'text-[#A5ADC6] hover:text-[#6E75F9]'
            }`}
            onClick={() => setActiveTab('position')}
          >
            Position
          </button>
          <button
            className={`font-medium text-sm h-8 flex items-center px-[10px] rounded-[8px] transition-colors ${
              activeTab === 'open-orders'
                ? 'bg-[#FAFAFA] text-[#131E40]'
                : 'text-[#A5ADC6] hover:text-[#6E75F9]'
            }`}
            onClick={() => setActiveTab('open-orders')}
          >
            Open orders
          </button>
        </div>
      </div>

      {/* Tabs */}

      {/* Content */}
      {activeTab === 'position' && (
        <div className="border border-[#ebebeb] rounded-[8px] p-4">
          {/* 表头：仅大屏显示 */}
          <div className="py-3 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 hidden md:grid">
            <div className="md:col-span-6 col-span-5">MARKET</div>
            <div className="md:col-span-3 col-span-3">OUTCOME</div>
            <div className="md:col-span-2 col-span-2 text-right">SHARES</div>
            <div className="md:col-span-1 col-span-2 text-right">VALUE</div>
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
                  className="py-4 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-2 border-b last:border-b-0"
                >
                  {/* MARKET */}
                  <div className="md:col-span-6 flex items-center justify-between gap-6">
                    {/* 小屏幕字段名 */}
                    <div className="md:hidden text-xs text-gray-400">MARKET</div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Image
                        src={position.market.image_url}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-lg object-cover flex-shrink-0 md:h-10 md:w-10 h-5 w-5"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/odds/market/${position.market.id}?chain=monad`}
                          className="font-medium mb-1 hover:text-pro-blue block truncate"
                        >
                          {position.market.title}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* OUTCOME */}
                  <div className="md:col-span-3 flex items-center justify-between gap-3">
                    <div className="md:hidden text-xs text-gray-400">OUTCOME</div>
                    <div className="flex items-center gap-1">
                      <Image
                        src={position.outcome.logo}
                        alt={position.outcome.name}
                        width={32}
                        height={32}
                        className="w-4 h-4 rounded-full md:h-10 md:w-10"
                      />
                      <span className="font-medium">{position.outcome.name}</span>
                    </div>
                  </div>

                  {/* SHARES */}
                  <div className="md:col-span-2 text-right flex md:block justify-between items-center w-full">
                    <span className="md:hidden text-xs text-gray-400">SHARES</span>
                    <span className="font-medium">{position.shares}</span>
                  </div>

                  {/* VALUE */}
                  <div className="md:col-span-1 text-right flex md:block justify-between items-center w-full">
                    <span className="md:hidden text-xs text-gray-400">VALUE</span>
                    <span className="font-medium">${position.value}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'open-orders' && (
        <div className="border border-[#ebebeb] rounded-[8px] p-4">
          {/* 表头：仅大屏显示 */}
          <div className="py-1 border-b grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 hidden md:grid">
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
            ) : !orders?.length ? (
              <div className="py-8 text-center text-gray-500">No open orders found.</div>
            ) : (
              (orders || []).map((order) => (
                <div
                  key={order.order_id}
                  className="py-4 md:grid md:grid-cols-12 md:gap-4 md:items-center flex flex-col gap-2 border-b last:border-b-0"
                >
                  {/* MARKET */}
                  <div className="md:col-span-5 flex items-center justify-between gap-3">
                    <div className="md:hidden text-xs text-gray-400">MARKET</div>
                    <div className="flex items-center justify-between gap-1 md:w-full min-w-0">
                      <Image
                        src={order.market.image_url}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-lg hidden md:block object-cover flex-shrink-0 md:h-10 md:w-10 h-5 w-5"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/odds/market/${order.market.id}?chain=monad`}
                          className="font-medium mb-1 hover:text-pro-blue block truncate"
                        >
                          {order.market.title}
                        </Link>
                        <div className="text-sm text-gray-600 md:block hidden">
                          {order.trading_direction === 'buy' ? 'Buy' : 'Sell'} @ ${order.price}
                        </div>
                        {/* 小屏幕字段名 */}
                        <div className="md:hidden text-xs text-gray-400">
                          {order.trading_direction === 'buy' ? 'Buy' : 'Sell'} @ ${order.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OUTCOME */}
                  <div className="md:col-span-2 flex items-center justify-between gap-3">
                    <span className="md:hidden text-xs text-gray-400">OUTCOME</span>
                    <div className="flex items-center gap-1">
                      <Image
                        src={order.outcome.logo}
                        alt={order.outcome.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium truncate">{order.outcome.name}</span>
                    </div>
                  </div>

                  {/* SHARES */}
                  <div className="md:col-span-2 text-right flex md:block justify-between items-center w-full">
                    <div className="md:hidden text-xs text-gray-400">SHARES</div>
                    <div className="flex items-center gap-1 md:justify-end">
                      <div className="font-medium">{order.available_shares}</div>
                      <div className="text-sm text-gray-600 md:block hidden">of {order.shares}</div>
                      <div className="md:hidden text-xs text-gray-400">of {order.shares}</div>
                    </div>
                  </div>

                  {/* VALUE + 操作 */}
                  <div className="md:col-span-3 flex md:justify-end md:items-center flex-col md:flex-row gap-2 md:gap-4 w-full md:text-right">
                    <div className="flex w-full items-center justify-between md:justify-end gap-3">
                      <div className="md:hidden text-xs text-gray-400">VALUE</div>
                      <div className="text-right md:w-auto">
                        <div className="font-medium">${order.available_value}</div>
                        <div className="text-sm text-gray-600 md:block hidden">
                          of ${order.value}
                        </div>
                        <div className="md:hidden text-xs text-gray-400">of ${order.value}</div>
                      </div>
                    </div>
                    <CancelOrder orderId={order.order_id} onSuccess={handleCancelOrderSuccess} />
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

function CancelOrder({
  orderId,
  onSuccess,
}: {
  orderId: string;
  onSuccess: (orderId: string) => void;
}) {
  const { data: userInfo } = useOddsUserInfo();
  const userId = userInfo?.user_id;

  const { mutateAsync: cancelOrder, isPending: isCancellingOrder } = useCancelOrder();

  async function handleCancelOrder(orderId: string) {
    if (!userId) return;

    try {
      await cancelOrder({
        order_id: orderId,
      });

      onSuccess(orderId);
    } catch (err) {
      console.error('Cancel order error:', err);
    }
  }

  return (
    <button
      onClick={() => handleCancelOrder(orderId)}
      className="px-3 py-1.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 w-full md:w-auto disabled:opacity-50"
      disabled={isCancellingOrder}
    >
      {isCancellingOrder ? 'Cancelling...' : 'Cancel'}
    </button>
  );
}
