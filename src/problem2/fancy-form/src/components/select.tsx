import { CaretDown } from "@phosphor-icons/react";
import { RefObject, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface SelectProps {
  options: OptionProps[];
  value?: string;
  onChange?: (value: string) => void;
}

interface OptionProps {
  value: string;
  icon?: string;
  text?: string;
}

function Select({ options, value, onChange }: SelectProps) {
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [open, setOpen] = useState(false);

  useOnClickOutside(ref, () => setOpen(false));
  const activeItem = value
    ? options.find((option) => option.value === value)
    : undefined;

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="bg-[#252B36] py-[6px] px-3 rounded-lg cursor-pointer"
      >
        <div className="flex items-center gap-x-1">
          {activeItem ? (
            <div className="flex items-center gap-x-1 select-none">
              <img src={activeItem?.icon} className="size-5" />
              <span className="inline-block w-16 text-sm max-sm:hidden">
                {activeItem?.text}
              </span>
            </div>
          ) : (
            <span className="text-sm block w-20">Select...</span>
          )}
          <CaretDown weight="bold" />
        </div>
      </div>
      {open ? (
        <div className="absolute z-10 top-full py-1 bg-[#252B36] mt-1 left-0 max-h-[160px] overflow-y-auto rounded">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                if (onChange) {
                  onChange(option.value);
                }
                setOpen(false);
              }}
            >
              <Option {...option} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Option({ icon, text }: OptionProps) {
  return (
    <div className="flex items-center gap-x-1 py-[6px] px-3 cursor-pointer hover:bg-[#2B3342]">
      <img src={icon} className="size-4" alt="" loading="lazy" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

export { Select, Option };
