import { startTransition, Suspense, useMemo } from "react";

import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FormProvider,
  SubmitErrorHandler,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-toastify";
import {
  ISettingsSchema,
  SettingsSchema,
  ISettingOption,
  ISettingsGroup,
  updateSettings,
  state,
  Themes,
  Positions,
} from "@/hooks/useSettings";
import { useSnapshot } from "valtio";
import { getFromObj } from "@/lib/utils";
import SettingsItem from "./SettingsItem";
import Loader from "@comp/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { SettingsOpts } from "./SettingsOpts";
interface SettingsGroupProps {
  children: React.ReactNode;
  name: string;
}

const SettingsGroup = (props: SettingsGroupProps) => {
  return (
    <fieldset className="border border-solid border-primary p-3 mb-4 flex flex-wrap">
      <legend className="text-xl">{props.name}</legend>
      {props.children}
    </fieldset>
  );
};

function Settings() {
  const snap = useSnapshot(state);

  const options = useMemo(() => {
    const opts = SettingsOpts;

    for (const group of opts) {
      for (const option of group.children) {
        const val = getFromObj<string>(snap.settings, option.name);

        option.value = val as any;
      }
    }

    return opts;
  }, [snap.settings]);

  const methods = useForm<ISettingsSchema>({
    resolver: zodResolver(SettingsSchema),
  });

  const onValid: SubmitHandler<ISettingsSchema> = async (data) => {
    const fn = async () => {
      await updateSettings(data);

      methods.reset(data);

      toast.success("Settings Saved", {
        position: "bottom-left",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        theme: "colored",
        toastId: "settings_saved",
        className: "bg-success bg-base-content",
      });
    };

    fn();
  };

  const onError: SubmitErrorHandler<ISettingsSchema> = (data) => {};

  if (!options) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onValid, onError)}>
            {options.map((group) => {
              return (
                <SettingsGroup key={group.name} name={group.name}>
                  {group.children.map((item) => {
                    return <SettingsItem key={item.name} item={item} />;
                  })}
                </SettingsGroup>
              );
            })}

            <div className="w-full sticky -bottom-5 py-3 flex justify-end bg-base-100">
              <button
                type="button"
                className="btn btn-accent text-base-100 mr-2"
                onClick={() => {
                  methods.reset(SettingsSchema.parse({}), {
                    keepDefaultValues: true,
                  });
                }}
              >
                Defaults
              </button>

              <button
                type="button"
                className="btn btn-accent text-base-100 mr-2"
                onClick={() => methods.reset()}
                disabled={!methods.formState.isDirty}
              >
                Reset
              </button>

              <button
                className="btn btn-primary text-base-100"
                disabled={!methods.formState.isDirty}
              >
                Save
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Suspense>
  );
}

export default Settings;
