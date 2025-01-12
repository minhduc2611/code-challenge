import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

enum BlockChainPriority {
  Osmosis = 100,
  Ethereum = 50,
  Arbitrum = 30,
  Zilliqa = 20,
  Neo = 20,
}
const DEFAULT_PRIORITY = -99;

interface WalletBalance {
  key: string;
  currency: string;
  amount: number;
  blockchain: string;
}

type PriceMap = Record<string, WalletBalance>;

class Datasource {
  dataUrl: string;
  constructor(dataUrl: string) {
    this.dataUrl = dataUrl;
  }
  async getPrices(): Promise<PriceMap> {
    const response = await axios.get<PriceMap>(this.dataUrl);
    return response.data;
  }
}

const useWalletBalances = () => [];
const WalletRow = () => (<></>);
const datasource = new Datasource(
  "https://interview.switcheo.com/prices.json"
);

interface Props {}

const usePrices = () => {
  const [priceMap, setPriceMap] = useState<PriceMap>({});
  const fetchPrice = async () => {
    try {
      const prices = await datasource.getPrices();
      setPriceMap(prices);
    } catch (error) {
      console.error(error);
    }
  };

  return { priceMap, fetchPrice };
}

const classes = { row: "" };

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const { priceMap, fetchPrice } = usePrices();
  
  useEffect(() => fetchPrice(), []);

  const getPriority = (blockchain: string): number => {
    return BlockChainPriority[blockchain] || DEFAULT_PRIORITY;
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => getPriority(balance.blockchain) > DEFAULT_PRIORITY && balance.amount <= 0)
      .sort((lhs: WalletBalance, rhs: WalletBalance) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain));
  }, [balances]);

  const renderRows = sortedBalances.map((balance: WalletBalance) => {
    const amount = +priceMap[balance.currency] || 0;
    const usdValue = amount * balance.amount;
    const formatted = balance.amount.toFixed();

    return (
      <WalletRow
        key={balance.key}
        className={classes.row}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formatted}
      />
    );
  });

  return <div {...rest}>{renderRows}</div>;
};

export default WalletPage;
