import React, { useRef } from 'react'
import CustomInput from './shared/Input'
import TextareaInput from './shared/Textarea'
import { networkFormDetail } from '../../store/network/formSlice'
import { useDispatch } from 'react-redux';
import { InputFile } from './shared/InputFile';

const NetworkDetailForm = () => {
    const dispatch = useDispatch();
   
    return (
        <div className="w-full ">
            <form className="px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <CustomInput id='name' type='text' label='name'
                        handleChange={(event: any) => {
                            dispatch(networkFormDetail.updateNetwork({ pName: event }));
                        }}
                    />
                    <TextareaInput id='comments'
                        handleChange={(event: any) => {
                            dispatch(networkFormDetail.updateNetwork({ pName: event }));
                        }}
                        label='Comments'
                    />
                    <InputFile/>
                   
                </div>
            </form>
        </div>
    )
}

export default NetworkDetailForm
