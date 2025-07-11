import Select from "./Select";
import Input from "./Input";
import AuthButton from "./buttons/AuthButton";
import { useEffect, useState} from "react";
import { Eye, EyeClosed } from "lucide-react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  checkButton,
  privacyPolicyText,
  loading
}) {

  const [showPassword, setShowPassword] = useState(false);

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <>
            {getControlItem?.label &&
              <div className="flex justify-between text-textSecondary">
                <label className="text-left  font-inter">{getControlItem.label}</label>
                {getControlItem?.type == "password" && (
                   <button
                    type="button"
                    className="text-sm flex gap-1 items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span>{showPassword ? <EyeClosed /> : <Eye/>}</span> <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                  // <div>
                  //   <p className=""><span>&#128065;</span> Hide</p>
                  // </div>
                  )
                }
              </div>}
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type === "password" ? 
                    (showPassword ? "text" : "password") : 
                    getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={"py-4"}
            />
          </>
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >

          </Select>
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ formData });
    }}>
      <div className="flex flex-col gap-4">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-2" key={controlItem.name}>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      {
        checkButton &&
        <div className="flex items-center gap-2">
          <div>
            <Input type="checkbox" id="privacyPolicy" />
          </div>
          <div>
            <label className="text-[11px] font-inter" for="privacyPolicy">{privacyPolicyText}</label>
          </div>
        </div>
      }

      <AuthButton disabled={isBtnDisabled} type="submit" className=" w-full mt-8 py-3 font-inter flex items-center justify-center">
        {loading ?
          <div className="flex items-center gap-2">
            <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            Loading...
          </div>
          : <p>{buttonText || "Submit"}</p>}
      </AuthButton>
    </form>
  );
}

export default CommonForm;
