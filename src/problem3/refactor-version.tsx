import React, { useMemo } from "react"; // import from react
import { BoxProps, WalletRow, classes } from "from-somewhere"; // or wherever comes from
import { useWalletBalances, usePrices } from "hooks"; // or wherever hooks comes from

// --- Type Definitions ---

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added blockchain to the interface
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

// Optionally define a union type or enum for known blockchains:
type KnownBlockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

// --- Helper Functions ---

const getPriority = (blockchain: string): number => {
  // You might restrict the parameter type to KnownBlockchain if appropriate.
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

// --- Component ---

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances(); // Assumed to return WalletBalance[]
  const prices = usePrices(); // Assumed to be an object with price mappings, e.g., { USD: number, … }

  // 1. Filter out invalid balances and those with non-positive amounts
  // 2. Sort balances based on blockchain priority (descending order)
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((a: WalletBalance, b: WalletBalance) => {
        return getPriority(b.blockchain) - getPriority(a.blockchain);
      });
  }, [balances]); // Removed prices from dependency since it's not used here

  // Add formatted field to each balance
  const formattedBalances = useMemo((): FormattedWalletBalance[] => {
    return sortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(), // Consider adding formatting options (e.g., locale, decimals)
    }));
  }, [sortedBalances]);

  // Generate rows using a stable key
  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      // Assume prices is an object mapping currency codes to USD price values
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row} // Ensure that classes.row is defined/imported correctly
          key={`${balance.currency}-${balance.amount}`} // A more stable key than the array index
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
