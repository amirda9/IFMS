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

        <div className="fixed inset-0">
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
                    // The height in here and the bottom padding of the main section must be equal
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
                    'relative flex h-full flex-grow flex-col bg-b pb-10', // Bottom padding in here and the height of the top bar must be equal
                    mainClassName,
                  )}>
                  {/* Dialog Content */}
                  <div
                    className={classNames(
                      'overflow-auto px-8',
                      contentClassName,
                    )}>
                    {children}
                  </div>

                  {/* Dialog Footer */}
                  {footer && (
                    <div className={classNames('px-8 py-4', contentClassName)}>
                      {/* {footer} */}
                      <p>Footer1</p>
                      <p>Footer2</p>
                      <p>Footer3</p>
                      <p>Footer4</p>
                      <p>Footer5</p>
                      <p>Footer6</p>
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
