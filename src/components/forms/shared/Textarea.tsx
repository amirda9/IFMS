import { memo, useState } from "react";
import { TextareaProps } from "../../../types/Textarea";
//It's a controlled input
const TextareaInput = ({
    id,
    placeholder,
    label,
    handleChange,
}: TextareaProps) => {
    const [bootstrapInputValue, setBootstrapInputValue] = useState<any>();

    const inputChangeHandler = (event: any) => {
        setBootstrapInputValue(event.target.value);
        handleChange(event.target.value);
    };

    return (

        <div className="mb-4 w-[80%]">
            <label className="flex items-center text-gray-700 text-sm" htmlFor={id}>
                <div className="mr-[4.6rem]">{label}</div>
                <textarea
                    id={id}
                    rows={4}
                    value={bootstrapInputValue || ""}
                    onChange={inputChangeHandler}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={placeholder} />
            </label>
        </div>

    )

};

export default memo(TextareaInput);
