type Radiotype = {
 check: boolean;
 onclick: () => void;
};
 function RadioButton({check, onclick}: Radiotype) {
 return (
   <div className="flex flex-row items-center">
     <button
     type="button"
       onClick={() => onclick()}
       className="flex h-[20px] w-[20px] items-center justify-center rounded-[10px] bg-[#ffffff]">
       <div
         className={`h-[10px] w-[10px] rounded-[5px] ${
           check ? 'bg-[#0E9836]' : 'bg-[#ffffff]'
         } `}></div>
     </button>
   </div>
 );
}

export default RadioButton