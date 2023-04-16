import { Controller, useFormContext } from "react-hook-form";

interface IProps {
  name: string;
  label: string;
  prefix?: string;
  type?: "text" | "number" | "password";
  className?: string;
  bgClass?: string;
  disabled?: boolean;
  placeholder?: string;
}

const FormInput = ({
  name,
  label,
  prefix,
  type = "text",
  className = "",
  bgClass = "",
  disabled = false,
  ...props
}: IProps) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();

  const errorMessage = errors?.[name]?.message;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className={`mb-3 block ${className}`}>
          <h3 className=" mb-1 block font-sans text-sm font-medium 2xl:text-base">
            {label}
          </h3>
          <div
            className={` m-0 flex w-full rounded border bg-clip-padding bg-no-repeat px-3 py-2 text-sm transition ease-in-out focus:outline-none 2xl:py-[5px] 2xl:text-base ${
              disabled
                ? "cursor-not-allowed bg-gray-100 opacity-70"
                : bgClass
                ? bgClass
                : "bg-white"
            }`}
          >
            {prefix ? <span className="pr-1">{prefix}</span> : null}
            <input
              {...field}
              {...props}
              type={type}
              disabled={disabled}
              onWheel={(event) => event.currentTarget.blur()}
              className="min-w-[50px] flex-1 focus:outline-none"
            />
          </div>
          {errorMessage ? (
            <div className="mt-2 text-sm text-red-500">{`${errorMessage?.toString()}`}</div>
          ) : null}
        </label>
      )}
    />
  );
};

export default FormInput;
