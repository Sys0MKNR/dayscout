import { ISettingOption } from "@/hooks/useSettings";
import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "tabler-icons-react";

const DefaultInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register } = useFormContext();

  return (
    <input
      {...props}
      {...register(props.name as any)}
      className="input input-bordered input-sm w-full"
    />
  );
};

const CheckBoxInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register, watch } = useFormContext();

  const watchCheck = watch(props.name as any, Boolean(props.defaultValue));

  return (
    <input
      {...props}
      {...register(props.name as any)}
      className="toggle"
      type="checkbox"
      checked={Boolean(watchCheck)}
    />
  );
};

const PasswordInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="input-group w-full input-group-sm">
      <input
        {...props}
        {...register(props.name as any)}
        type={showPassword ? "text" : "password"}
        className="input input-bordered w-full input-sm"
      />
      <button
        className="btn btn-square swap btn-sm"
        type="button"
        onClick={() => setShowPassword((p) => !p)}
      >
        {showPassword ? <EyeOff></EyeOff> : <Eye></Eye>}
      </button>
    </div>
  );
};

const ColorInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register } = useFormContext();

  return (
    <input
      {...props}
      {...register(props.name as any)}
      className="btn btn-sm"
      type="color"
    />
  );
};

const SelectInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) => {
  const { register } = useFormContext();

  return (
    <select
      {...props}
      {...register(props.name as any)}
      className="select select-bordered select-sm"
    >
      <option disabled>{props.placeholder}</option>
      {props.children}
    </select>
  );
};

const RangeInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register } = useFormContext();

  return (
    <input
      {...props}
      {...register(props.name as any)}
      className="range range-sm"
      type="range"
    />
  );
};

// const HidableInputElement = (
//   props: DetailedHTMLProps<
//     InputHTMLAttributes<HTMLInputElement>,
//     HTMLInputElement
//   >
// ) => {
//   const { register } = useFormContext();

//   const hiderName = (props.name as string) + ".active";
//   const valueName = (props.name as string) + ".value";

//   const [showInput, setShowInput] = useState(false);

//   console.log(props);

//   return (
//     <div className="input-group w-full input-group-sm">
//       <CheckBoxInputElement name={hiderName} />
//       <input
//         {...props}
//         {...register(valueName)}
//         defaultValue={(props.defaultValue as any).value}
//         className="input input-bordered w-full input-xs"
//       />
//     </div>
//   );
// };

function getInputElement(type: string) {
  switch (type) {
    case "password":
      return PasswordInputElement;
    case "checkbox":
      return CheckBoxInputElement;
    case "color":
      return ColorInputElement;
    case "select":
      return SelectInputElement;
    case "range":
      return RangeInputElement;
    // case "hidable":
    //   return HidableInputElement;
    default:
      return DefaultInputElement;
  }
}

interface SettingsItemProps {
  item: ISettingOption;
}

const SettingsItem = (props: SettingsItemProps) => {
  const { item } = props;
  const {
    name,
    label,
    placeholder,
    value,
    type = "text",
    children,
    customProps,
    stacked = true,
    className,
  } = item;

  const Input = getInputElement(type);

  const orientation = stacked ? "flex-col" : "items-center";

  const margin = stacked ? "" : "mr-2";

  return (
    <div
      className={`${
        item.width || "w-full"
      } px-4 flex ${orientation} ${className}`}
    >
      <label htmlFor={name} className={`label ${margin}`}>
        <span className="label-text text-base min-h-6">{label || name}</span>
      </label>

      <Input
        name={name}
        type={type}
        placeholder={placeholder || name}
        defaultValue={value}
        children={children}
        {...customProps}
      />
    </div>
  );
};

export default SettingsItem;
