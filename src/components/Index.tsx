import { useState } from 'react';
import { Row, Col, Input, Button, Form, List } from 'antd';
import { useOrdinals } from '../hooks/ordinals';

export default function Index() {
    const [address, setAddress] = useState<string>('');

    const handleSearch = (payload: { bitcoinAddress: string }) => {
        console.log(payload);
        setAddress(payload.bitcoinAddress);
    };

    return (
        <>
            <Form layout='vertical' onFinish={handleSearch}>
                <Row gutter={16}>
                    <Col>
                        <Form.Item label='Owner Bitcoin Address:' name='bitcoinAddress'>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Form.Item>
                        <Col>
                            <Button htmlType='submit' type="primary">Look up</Button>
                        </Col>
                    </Form.Item>
                </Row>
            </Form>

            {address && <OrdinalList bitcoinAddress={address} />}
        </>
    );
};

function OrdinalList({ bitcoinAddress }: { bitcoinAddress: string }) {
    const { data } = useOrdinals(bitcoinAddress);
    const ordinalsData = data?.results || [];
    console.log(data);

    return (
        <>
            <p>Results</p>
            <List
                itemLayout='horizontal'
                dataSource={ordinalsData}
                pagination={false}
                footer={null}
                renderItem={item => {
                    return item?.inscriptions?.map((inscription) => (
                        <List.Item
                            style={{
                                backgroundColor: '#F4F6FC',
                                borderRadius: '20px',
                                width: '80%',
                                margin: '1.5em auto 0 auto',
                                padding: '1.5em'
                            }}
                        >
                            <List.Item.Meta
                                title={<h2>Inscriptions</h2>}
                            />

                            <p>{inscription.id}</p>
                        </List.Item>
                    ));

                }} />
        </>
    )
}