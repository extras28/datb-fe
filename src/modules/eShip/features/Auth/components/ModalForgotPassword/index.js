import authApi from 'api/authApi';
import { FastField, Formik } from 'formik';
import KTFormGroup from 'general/components/OtherKeenComponents/Forms/KTFormGroup';
import KTFormInput, {
  KTFormInputType,
} from 'general/components/OtherKeenComponents/Forms/KTFormInput';
import ToastHelper from 'general/helpers/ToastHelper';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

ModalForgotPassword.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

ModalForgotPassword.defaultProps = {
  show: false,
  onClose: null,
};

function ModalForgotPassword(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { show, onClose } = props;

  // MARK: --- Functions ---
  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string().required(t('Required')).email(t('EmailNotValid')),
        })}
        enableReinitialize
        onSubmit={async (values) => {
          try {
            const res = await authApi.forgotPassword({ signInName: values.email });
            const { result } = res;
            if (result === 'success') {
              ToastHelper.showSuccess(t('RequestResetPasswordSuccess'));
            }
          } catch (error) {
            console.log(`Request reset password error: ${error?.message}`);
          }
        }}
      >
        {(formikProps) => (
          <Modal
            className=""
            show={show}
            onHide={handleClose}
            centered
            onExit={() => {
              formikProps.handleReset();
            }}
          >
            <Modal.Header className="px-5 py-5">
              <Modal.Title>{t('ForgotPassword')}</Modal.Title>
              <div
                className="btn btn-xs btn-icon btn-light btn-hover-secondary cursor-pointer"
                onClick={() => {
                  handleClose();
                }}
              >
                <i className="far fa-times"></i>
              </div>
            </Modal.Header>

            <Modal.Body>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <i className="fad fa-user text-primary fa-6x" />
              </div>
              <div className="row">
                <div className="col-12">
                  {/* email */}
                  <KTFormGroup
                    label={
                      <>
                        {t('Email')} <span className="text-danger">(*)</span>
                      </>
                    }
                    inputName="email"
                    additionalClassName="mb-0"
                    inputElement={
                      <FastField name="email">
                        {({ field, form, meta }) => (
                          <KTFormInput
                            name={field.name}
                            value={field.value}
                            onChange={(value) => {
                              form.setFieldValue(field.name, value);
                            }}
                            onBlur={() => {
                              form.setFieldTouched(field.name, true);
                            }}
                            enableCheckValid
                            isValid={_.isEmpty(meta.error)}
                            isTouched={meta.touched}
                            feedbackText={meta.error}
                            type={KTFormInputType.text}
                            placeholder={`${_.capitalize(t('Email'))}...`}
                          />
                        )}
                      </FastField>
                    }
                  />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="w-100 d-flex row">
                {
                  <Button
                    className="font-weight-bold flex-grow-1 col mr-3"
                    variant="secondary"
                    onClick={handleClose}
                  >
                    {t('Cancel')}
                  </Button>
                }
                <Button
                  className={`font-weight-bold flex-grow-1 col ml-3`}
                  variant="primary"
                  onClick={() => {
                    formikProps.handleSubmit();
                  }}
                >
                  {t('Confirm')}
                </Button>
              </div>
            </Modal.Footer>
          </Modal>
        )}
      </Formik>
    </div>
  );
}

export default ModalForgotPassword;
