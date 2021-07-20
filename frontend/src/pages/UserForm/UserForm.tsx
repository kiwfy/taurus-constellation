import React from 'react';
import Default from '../../layouts/Default/Default';
import Container from '../../components/Container/Container';
import Row from '../../components/Row/Row';
import Col from '../../components/Col/Col';
import Card from '../../components/Card/Card';
import styles from './styles.module.scss';
import InputBlock from '../../components/InputBlock/InputBlock';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';

const UserForm: React.FC = () => {
  const title = 'Create User';

  const rolesOptions = [
    {
      label: 'Administrator',
      value: 'administrator',
    },
    {
      label: 'Controller',
      value: 'controller',
    },
    {
      label: 'Guest',
      value: 'guest',
    },
  ];

  const groupsOptions = [
    {
      label: 'arktis',
      value: '1',
    },
    {
      label: 'organic-search',
      value: '2',
    },
  ];

  return (
    <Default>
      <Card title="Create User">
        <Container>
          <Row>
            <Col xs={12} md={6} style={{ marginBottom: '20px' }}>
              <InputBlock label="Name" required>
                <Input type="text" />
              </InputBlock>
            </Col>
            <Col xs={12} md={6}>
              <InputBlock label="Email" required>
                <Input type="email" />
              </InputBlock>
            </Col>
            <Col xs={12} md={6}>
              <InputBlock label="Role" required>
                <Select options={rolesOptions} />
              </InputBlock>
            </Col>
            <Col xs={12} md={6}>
              <InputBlock label="Groups" required>
                <Select options={groupsOptions} isMulti />
              </InputBlock>
            </Col>
            <Col xs={12} className={styles.actions}>
              <Button variant="default">
                Cancel
              </Button>
              <Button variant="primary">
                Save
              </Button>
            </Col>
          </Row>
        </Container>

      </Card>
    </Default>
  );
};

export default UserForm;
