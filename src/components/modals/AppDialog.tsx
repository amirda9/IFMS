import {Dialog, Transition} from '@headlessui/react';
import {FC, Fragment, ReactNode, useState} from 'react';
import {IoCloseOutline} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import classNames from '~/util/classNames';

type Props = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  topBarClassName?: string;
  mainClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  closefunc?:()=>void
};

const AppDialog: FC<Props> = ({
  title,
  children,
  footer,
  topBarClassName,
  mainClassName,
  contentClassName,
  footerClassName,
  closefunc
}) => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    if(closefunc){
      closefunc()
    }else{
      navigate('..');
    }

  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 flex flex-col justify-center">
          <div className="flex h-5/6 items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="flex h-full w-10/12 transform flex-col overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className={classNames(
                    'flex h-10 bg-p px-8 py-2 text-lg font-medium leading-6 text-gray-900',
                    topBarClassName,
                  )}>
                  {title && <span className="text-white">{title}</span>}
                  <IoCloseOutline
                    onClick={handleClose}
                    className="ml-auto text-white"
                    size={24}
                  />
                </Dialog.Title>

                {/* Dialog Main */}
                <div
                  className={classNames(
                    'relative flex h-[calc(100%-20rem)] flex-grow flex-col bg-b', // Height is 100% minus the height of the top bar
                    mainClassName,
                  )}>
                  {/* Dialog Content */}
                  <div
                    className={classNames(
                      'flex-grow overflow-auto px-8 pt-4',
                      contentClassName,
                    )}>
                    {children}
                  </div>

                  {/* Dialog Footer */}
                  {footer && (
                    <div className={classNames('px-8 py-4', footerClassName)}>
                      {footer}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AppDialog;
