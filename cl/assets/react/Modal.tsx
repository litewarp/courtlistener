import React from 'react';

const ModalWrapper = ({ children, visible }: { children: React.ReactNode; visible: boolean }) => {
  return (
    <div
      id="modal-outer"
      style={{
        zIndex: '100',
        height: '700px',
        maxHeight: '100%',
        width: '700px',
        maxWidth: '100%',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: visible ? 'flex' : 'none',
        backgroundColor: 'white',
        boxShadow: '0 0 60px 10px rgba(0, 0, 0, 0.9)',
      }}
    >
      {children}
    </div>
  );
};

const CloseButton = ({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
  return (
    <button
      onClick={onClick}
      className="btn btn-primary"
      style={{
        position: 'absolute',
        zIndex: '100',
        top: '10px',
        right: '20px',
        border: '0',
        padding: '1rem',
      }}
    >
      <i className="fa fa-times"></i>
    </button>
  );
};

const ModalHeader = ({ text }: { text: string }) => {
  return (
    <h2
      id="modal-header"
      style={{
        padding: '5px',
        display: 'flex',
      }}
    >
      {text}
    </h2>
  );
};

const ModalInner = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="modal-inner"
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        padding: '.5rem 2.5rem',
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  );
};

const ModalOverlay = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="modal-overlay"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      {children}
    </div>
  );
};

interface ModalProps {
  heading: string;
  visible: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

const Modal = ({ heading, visible, closeModal, children }: ModalProps) => {
  return (
    <>
      <ModalWrapper visible={visible}>
        <CloseButton onClick={() => closeModal()} />
        <ModalInner>
          <ModalHeader text={heading} />
          {children}
        </ModalInner>
      </ModalWrapper>
      {visible && <ModalOverlay />}
    </>
  );
};

export default Modal;
