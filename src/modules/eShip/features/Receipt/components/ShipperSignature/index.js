import KTTooltip from 'general/components/OtherKeenComponents/KTTooltip';
import Utils from 'general/utils/Utils';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactSignatureCanvas from 'react-signature-canvas';

ShipperSignature.propTypes = {
  onSignDone: PropTypes.func,
  signatureItem: PropTypes.string,
};

ShipperSignature.defaultProps = {
  onSignDone: null,
  signatureItem: '',
};

function ShipperSignature(props) {
  // MARK: ---- Params ----
  const { onSignDone, signatureItem } = props;
  const signaturePadRef = useRef(null);
  const { t } = useTranslation();

  const clearSignature = () => {
    signaturePadRef.current.clear();
    signaturePadRef.current.on();
  };

  const saveSignature = () => {
    const signatureBlob = signaturePadRef.current.toDataURL();

    const blob = base64ToBlob(signatureBlob);

    if (onSignDone) {
      onSignDone(blob);
    }
  };

  function base64ToBlob(base64String) {
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/png' });
  }

  useEffect(() => {
    if (signatureItem && signatureItem != 'null') {
      fetch(signatureItem)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            signaturePadRef.current.fromDataURL(base64data);
          };
        })
        .catch((error) => console.error('Error:', error));

      signaturePadRef.current.off();
    }
    console.log(signatureItem);
  }, [signatureItem]);

  return (
    <div className="position-relative">
      <div className="border rounded" style={{ height: 250, width: '100%' }}>
        <ReactSignatureCanvas
          ref={signaturePadRef}
          onEnd={saveSignature}
          penColor="black"
          canvasProps={{ className: 'w-100 h-100' }}
        />
      </div>
      <div className="position-absolute" style={{ top: 10, right: 10 }}>
        <div className="d-flex flex-row">
          <KTTooltip text={t('Delete')}>
            <a
              className="btn btn-icon btn-sm btn-danger btn-hover-danger mr-2"
              onClick={(e) => {
                clearSignature();
              }}
            >
              <i className="fa-regular fa-xmark p-0 icon-1x" />
            </a>
          </KTTooltip>
        </div>
      </div>
    </div>
  );
}

export default ShipperSignature;
