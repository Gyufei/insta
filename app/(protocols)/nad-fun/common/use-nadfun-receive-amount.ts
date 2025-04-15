import { useNadFunTokenMarketInfo, INadFunTokenMarketInfo } from '@/lib/data/use-nadfun-token-market-info';
import { parseBig } from '@/lib/utils/number';

// 处理科学计数法格式的数字，转换为普通字符串
function handleScientificNotation(num: string): string {
  if (num.includes('e') || num.includes('E')) {
    return Number(num).toString();
  }
  return num;
}

// 获取市场数据并转换为 x, y 值
function getMarketData(tokenAddress: string | undefined, marketInfo: INadFunTokenMarketInfo | null | undefined) {
  // 检查基本参数
  if (!tokenAddress) return { x: BigInt(0), y: BigInt(0), error: 'Token address is required' };
  if (!marketInfo) return { x: BigInt(0), y: BigInt(0), error: 'Market info is required' };

  try {
    const { virtual_token, virtual_native } = marketInfo;
    
    // 检查市场数据是否有效
    if (!virtual_token || !virtual_native) {
      return { x: BigInt(0), y: BigInt(0), error: 'Invalid market data' };
    }
    
    // 处理科学计数法格式的数字
    const virtualNativeStr = handleScientificNotation(virtual_native);
    const virtualTokenStr = handleScientificNotation(virtual_token);
    
    // 检查转换后的字符串是否有效
    if (!virtualNativeStr || !virtualTokenStr) {
      return { x: BigInt(0), y: BigInt(0), error: 'Invalid virtual token data' };
    }
    
    // x 代表池子中的原生代币数量
    const x = BigInt(virtualNativeStr);
    // y 代表池子中的代币数量
    const y = BigInt(virtualTokenStr);
    
    // 检查转换后的 BigInt 是否有效
    if (x <= BigInt(0) || y <= BigInt(0)) {
      return { x: BigInt(0), y: BigInt(0), error: 'Invalid virtual token values' };
    }
    
    return { x, y, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { x: BigInt(0), y: BigInt(0), error: `Market data error: ${error.message}` };
    }
    return { x: BigInt(0), y: BigInt(0), error: 'Unknown market data error' };
  }
}

// 解析输入金额
function parseAmount(amount: string) {
  if (!amount || amount === '0') return { amountBig: BigInt(0), error: 'Amount is required' };
  
  try {
    const amountDecimal = parseBig(amount);
    const amountBig = BigInt(amountDecimal);
    
    if (amountBig <= BigInt(0)) {
      return { amountBig: BigInt(0), error: 'Invalid amount' };
    }
    
    return { amountBig, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { amountBig: BigInt(0), error: `Amount parsing error: ${error.message}` };
    }
    return { amountBig: BigInt(0), error: 'Unknown amount parsing error' };
  }
}

export function useNadFunReceiveAmount(tokenAddress: string | undefined) {
  const { data: marketInfo } = useNadFunTokenMarketInfo(tokenAddress);

  function calcTokenOut(amountIn: string) {
    try {
      // 获取市场数据
      const { x, y, error: marketError } = getMarketData(tokenAddress, marketInfo);
      if (marketError) {
        return BigInt(0);
      }
      
      // 解析输入金额
      const { amountBig, error: amountError } = parseAmount(amountIn);
      if (amountError) {
        return BigInt(0);
      }
      
      // 检查是否会导致溢出
      try {
        // k 代表流动性常数，k = x * y
        const k = y * x;
        
        // 计算新的 x 值：x_new = x + amountIn
        const x_new = amountBig + x;
        
        // 检查计算结果是否有效
        if (x_new <= BigInt(0)) {
          throw new Error('Invalid calculation result');
        }
        
        // 根据 x * y = k 公式，计算新的 y 值：y_new = k / x_new
        // 注意：这里使用了 (k + x_new - 1) / x_new 来处理舍入误差
        const y_new = (k + x_new - BigInt(1)) / x_new;
        
        // 检查计算结果是否有效
        if (y_new >= y) {
          throw new Error('Insufficient liquidity. Please adjust the amount.');
        }
        
        // 计算输出金额：amountOut = y - y_new
        const result = y - y_new;
        
        // 检查最终结果是否有效
        if (result <= BigInt(0)) {
          throw new Error('Invalid output amount');
        }
        
        return result;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Calculation error: ${error.message}`);
        }
        throw new Error('Unknown calculation error');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      }
      throw new Error('Unknown token out calculation error');
    }
  }

  function calcTokenIn(amountOut: string) {
    try {
      // 获取市场数据
      const { x, y, error: marketError } = getMarketData(tokenAddress, marketInfo);
      if (marketError) {
        return BigInt(0);
      }
      
      // 解析输入金额
      const { amountBig, error: amountError } = parseAmount(amountOut);
      if (amountError) {
        return BigInt(0);
      }
      
      // 检查输出金额是否超过池子中的代币数量
      if (amountBig >= y) {
        throw new Error('Insufficient liquidity. Please adjust the amount.');
      }
      
      // 检查是否会导致溢出
      try {
        // k 代表流动性常数，k = x * y
        const k = y * x;
        
        // 计算新的 y 值：y_new = y - amountOut
        const y_new = y - amountBig;
        
        // 检查分母是否有效
        if (y_new <= BigInt(0)) {
          throw new Error('Invalid calculation. Denominator is zero or negative.');
        }
        
        // 检查除法是否会导致溢出
        if (k < y_new) {
          throw new Error('Calculation would result in a value less than 1.');
        }
        
        // 根据 x * y = k 公式，计算新的 x 值：x_new = k / y_new
        const x_new = k / y_new;
        
        // 计算输入金额：amountIn = x_new - x
        const amountInBig = x_new - x;
        
        // 检查计算结果是否有效
        if (amountInBig <= BigInt(0)) {
          throw new Error('Invalid calculation result. Input amount would be zero or negative.');
        }
        
        // 检查计算结果是否合理（例如，不应该超过池子中的代币数量太多）
        if (amountInBig > x * BigInt(10)) {
          throw new Error('Calculated input amount is unreasonably large. Please check the values.');
        }
        
        return amountInBig;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Calculation error: ${error.message}`);
        }
        throw new Error('Unknown calculation error');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      }
      throw new Error('Unknown token in calculation error');
    }
  }

  return {
    calcTokenOut,
    calcTokenIn,
  };
}
