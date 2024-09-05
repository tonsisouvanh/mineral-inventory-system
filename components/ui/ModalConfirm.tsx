import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

type IconType = "info" | "success" | "warning" | "error";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAction: (...args: unknown[]) => void;
  isPending?: boolean;
  modalText?: string;
  actionArgs?: unknown[];
  title?: string;
  iconType?: IconType;
};

const getIcon = (type: IconType) => {
  switch (type) {
    case "info":
      return <InfoCircleOutlined style={{ color: "#1890ff" }} />;
    case "success":
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    case "warning":
      return <ExclamationCircleOutlined style={{ color: "#faad14" }} />;
    case "error":
      return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
    default:
      return null;
  }
};

const ModalConfirm: React.FC<Props> = ({
  open,
  setOpen,
  handleAction,
  isPending,
  modalText = "Are you sure you want to perform this action?",
  actionArgs = [],
  title = "Confirm Action",
  iconType = "info",
}) => {
  const [shouldClose, setShouldClose] = useState(false);

  useEffect(() => {
    if (!isPending && shouldClose) {
      setOpen(false);
    }
  }, [isPending, shouldClose, setOpen]);

  const handleOk = () => {
    setShouldClose(true);
    handleAction(...actionArgs);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      confirmLoading={isPending}
      onCancel={handleCancel}
    >
      <div className="flex items-center gap-2 text-xl">
        {getIcon(iconType)}
        <h1>{title}</h1>
      </div>
      <p>{modalText}</p>
    </Modal>
  );
};

export default ModalConfirm;
