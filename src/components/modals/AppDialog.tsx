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
};

const AppDialog: FC<Props> = ({
  title,
  children,
  footer,
  topBarClassName,
  mainClassName,
  contentClassName,
  footerClassName,
}) => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate('..');
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="flex flex-col w-10/12 transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className={classNames(
                    'flex bg-p px-8 py-2 text-lg font-medium leading-6 text-gray-900',
                    topBarClassName,
                  )}>
                  {title && <span className="text-white">{title}</span>}
                  <IoCloseOutline onClick={handleClose} className="ml-auto text-white" size={24} />
                </Dialog.Title>

                {/* Dialog Main */}
                <div
                  className={classNames(
                    'flex-grow bg-b p-8',
                    mainClassName,
                  )}>
                  {/* Dialog Content */}
                  <div className={classNames('h-full', contentClassName)}>
                    {children}
                  </div>

                  {/* Dialog Footer */}
                  {footer && (
                    <div className={classNames('mt-4', contentClassName)}>
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
