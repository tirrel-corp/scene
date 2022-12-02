import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import cn from 'classnames';
import Modal from './Modal';

const BackgroundModal = props => {
  const {className, ...rest} = props;
  return (
    <Modal title="Change Desktop Background" {...rest}>
      <div id="xyz">
        <div className="min-h-[50vh] min-w-[60ch]">
          gabagool
        </div>
      </div>
    </Modal>
  )
};

export default BackgroundModal;
