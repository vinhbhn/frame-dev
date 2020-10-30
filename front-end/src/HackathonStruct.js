import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Card } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';

import { TxButton } from './substrate-lib/components';

function Main(props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [currentUsername, setCurrentUsername] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [currentAgree, setCurrentAgree] = useState(false);
  const [formAgree, setFormAgree] = useState(false);

  useEffect(() => {
    let unsubscribe;
    api.query.templateModule
      .hackathons((newValue) => {
        if (newValue.isNone) {
          setCurrentUsername('<None>');
          setCurrentAgree(false);
        } else {
          console.log(newValue);
          setCurrentUsername(newValue.Username.toHuman());
          setCurrentAgree(newValue.Agree);
        }
      })
      .then((unsub) => {
        unsubscribe = unsub;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column width={8}>
      <h1>HackathonStruct</h1>
      <Card centered>
        <Card.Content textAlign='center'>
          <Card.Header content={`name: ${currentUsername}`} />
        </Card.Content>
        <Card.Content extra>Agree? {currentAgree.toString()}</Card.Content>
      </Card>
      <Form>
        <Form.Field>
          <Input
            label='Username'
            state='please input your name'
            type='string'
            onChange={(_, { value }) => setFormUsername(value)}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label='Agree'
            state='newValue'
            type='checkbox'
            onChange={(e) => setFormAgree(e.target.checked)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Save'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'doHackathon',
              inputParams: [{ Username: formUsername, Agree: formAgree }],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function HackathonStruct(props) {
  const { api } = useSubstrate();
  return api.query.templateModule && api.query.templateModule.something ? (
    <Main {...props} />
  ) : null;
}
