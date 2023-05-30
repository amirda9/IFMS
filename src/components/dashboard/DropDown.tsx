type DropDownItem = {
    title: string,
    link: string
}[]
type Props = {
    items: DropDownItem,
    title: string
};
const DropDown: React.FC<Props> = ({ items, title }) => {


    return (
        <div className="">
            <div className="dropdown inline-block relative">
                <button className="  text-white py-2 px-4 rounded inline-flex items-center">
                    <span className="mr-1">{title}</span>
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
                </button>
                <ul className="dropdown-menu absolute hidden text-white pt-1">
                    {items.map(el => (
                        <li key={el.title} className=""><a className=" bg-[#006BBC] hover:bg-[#308bd1] py-2 pr-20 pl-4 block whitespace-nowrap" href="#">{el.title}</a></li>

                    ))}
                     
                </ul>
            </div>

        </div>
    )
}

export default DropDown