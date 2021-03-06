import React from 'react';
import BFormGroup from 'react-bootstrap/FormGroup';
import BFormLabel from 'react-bootstrap/FormLabel';
import BFormText from 'react-bootstrap/FormText';
import styles from './styles.module.scss';

interface FormGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({
  children,
  error,
  required,
  label,
  className,
}) => (
  <BFormGroup className={`${styles.formGroup} ${className}`}>
    <BFormLabel className={styles.label}>
      {label}
      {
        required
        && <div className={styles.required} />
      }
    </BFormLabel>

    {children}

    <BFormText
      as="div"
      className={styles.error}
    >
      {error}
    </BFormText>
  </BFormGroup>
);

export default FormGroup;
