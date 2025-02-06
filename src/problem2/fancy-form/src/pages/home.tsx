import { Controller, useForm } from "react-hook-form";
import { Select } from "../components/select";
import { useQuery } from "@tanstack/react-query";
import { ArrowsDownUp } from "@phosphor-icons/react";
import toast from "react-hot-toast";

interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

interface FormInputs {
  swapFrom: string;
  swapTo: string;
  swapValue: number;
}

function Home() {
  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    toast.success("Swap Success!");
  };

  const tokens = useQuery({
    queryKey: ["tokens"],
    queryFn: async () => {
      try {
        const response: TokenPrice[] = await fetch(
          "https://interview.switcheo.com/prices.json"
        ).then((res) => res.json());
        return response.map((item) => ({
          ...item,
          icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`,
          value: item.currency,
          text: item.currency,
        }));
      } catch (error) {
        console.error("🚀 ~ queryFn: ~ error:", error);
        throw new Error("failed to fetch tokens");
      }
    },
  });

  const currSwapFrom = tokens.data?.find(
    (token) => token.currency === watch("swapFrom")
  );
  const currSwapTo = tokens.data?.find(
    (token) => token.currency === watch("swapTo")
  );

  return (
    <main className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <form
          className="bg-[#252B36] p-2 rounded-md block space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-center">Fancy Swap Form</h1>
          <div className="space-y-2">
            <div
              className={`field-group border ${
                errors.swapFrom || errors.swapValue
                  ? "border-red-500"
                  : "border-transparent"
              }`}
            >
              <Controller
                control={control}
                name="swapFrom"
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={tokens.data ?? []}
                    onChange={(value) => {
                      if (currSwapTo?.value === value) {
                        const c = currSwapTo;
                        setValue("swapTo", field.value);
                        field.onChange(c.currency);
                      } else {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
              <input
                type="number"
                size={1}
                className="flex-1 bg-transparent block text-right min-w-0"
                placeholder="0.00"
                {...register("swapValue", {
                  required: true,
                })}
              />
            </div>
            <div>
              <ArrowsDownUp weight="bold" className="mx-auto" />
            </div>
            <div
              className={`field-group border ${
                errors.swapTo ? "border-red-500" : "border-transparent"
              }`}
            >
              <Controller
                control={control}
                name="swapTo"
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={
                      tokens.data?.filter(
                        (item) => item.currency !== currSwapFrom?.currency
                      ) ?? []
                    }
                    onChange={(value) => {
                      if (currSwapFrom?.value === value) {
                        const c = currSwapFrom;
                        setValue("swapFrom", field.value);
                        field.onChange(c.currency);
                      } else {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
              <input
                type="number"
                size={1}
                className="flex-1 bg-transparent block text-right min-w-0"
                placeholder="0.00"
                disabled
                value={
                  (watch("swapValue") || 0) *
                  ((currSwapFrom?.price || 0) / (currSwapTo?.price || 0))
                }
              />
            </div>
            {currSwapFrom && currSwapTo ? (
              <div className="text-right text-xs">
                1 {currSwapFrom.text} ={" "}
                {(currSwapFrom.price / currSwapTo.price).toFixed(4)}{" "}
                {currSwapTo.text}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-[#C4B454] text-white h-10 rounded-lg cursor-pointer"
          >
            Swap
          </button>
        </form>
      </div>
    </main>
  );
}

export default Home;
