import React, { useState } from 'react';

import { Modal } from 'antd';
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleLogout: () => void;
  isPending?: boolean;
};

const ModalConfirmSignOut: React.FC<Props> = ({ open, setOpen, handleLogout, isPending }) => {
  const [modalText, setModalText] = useState('You will be signed out. Continue?');

  const handleOk = () => {
    handleLogout();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal title="Sign Out" open={open} onOk={handleOk} confirmLoading={isPending} onCancel={handleCancel}>
        <p>{modalText}</p>
      </Modal>
    </>
  );
};

export default ModalConfirmSignOut;
