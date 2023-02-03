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

  return <input {...props} {...register(props.name as any)} />;
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
    <div className="input-group">
      <input
        {...props}
        {...register(props.name as any)}
        type={showPassword ? "text" : "password"}
      />
      <button
        className="btn btn-square swap"
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
      className="btn btn-xs"
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
  } = item;

  const Input = getInputElement(type);

  return (
    <div className={`${item.width || "w-full"} px-4`}>
      <label htmlFor={name} className="label">
        <span className="label-text text-base">{label || name}</span>
      </label>

      <Input
        name={name}
        type={type}
        className="input input-bordered w-full"
        placeholder={placeholder || name}
        defaultValue={value}
        children={children}
        {...customProps}
      />
    </div>
  );
};

export default SettingsItem;
