import React, { memo, useState } from "react";
import { InputProps } from "../../../types/form/Input";

//It's a controlled input
const CustomInput = ({
    id,
    placeholder,
    label,
    type,
    handleChange,
}: InputProps) => {
    const [bootstrapInputValue, setBootstrapInputValue] = useState<any>();

    const inputChangeHandler = (event: any) => {
        setBootstrapInputValue(event.target.value);
        handleChange(event.target.value);
    };

    return (

        <div className="mb-4 flex items-center w-[80%]">
            <label className="block text-gray-700 text-sm" htmlFor={id}>
                <div className="mr-[6.8rem]">{label}</div>
            </label>
            <input
                id={id}
                value={bootstrapInputValue || ""}
                onChange={inputChangeHandler}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type={type}
                placeholder={placeholder} />
        </div>

    )

};

export default memo(CustomInput);
