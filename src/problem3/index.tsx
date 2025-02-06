interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {} // BoxProps was not found

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;

  // hooks wasn't imported
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    // Using "any" loses the benefits of TypeScript’s static type checking.
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // Confusing (and Likely Incorrect) Filtering Logic
        if (lhsPriority > -99) {
          // checked variable lhsPriority instead of balancePriority
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain); // Property 'blockchain' does not exist on type 'WalletBalance'.
        const rightPriority = getPriority(rhs.blockchain); // Property 'blockchain' does not exist on type 'WalletBalance'.
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
    //   Chaining Filter and Sort Directly => inefficient when balances is a large array.
  }, [balances, prices]); // Inefficient / Unclear useMemo Dependencies

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    // Unused
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        // WalletRow wasn't imported
        <WalletRow
          className={classes.row} // classes wasn't imported
          key={index} // Using index as a React key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
