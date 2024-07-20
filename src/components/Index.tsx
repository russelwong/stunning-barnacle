import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Row, Col, Image, Input, Button, Form, List, Drawer, Typography, Divider, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ReactSVG } from 'react-svg'
import { useOrdinals, useInscriptionsDetails, useInscriptionsContent } from '../hooks/ordinals';
import { isImageMIMEType } from '../helpers/mime-validator';

const { Title, Paragraph, Text } = Typography;

const whiteText = { color: 'white' };
const whiteTitle = { color: 'white', opacity: 0.7, fontSize: '0.9em' };

export default function Index() {
    const [address, setAddress] = useState<string>('');

    const handleSearch = (payload: { bitcoinAddress: string }) => {
        setAddress(payload.bitcoinAddress);
    };

    return (
        <>
            <Form layout='vertical' onFinish={handleSearch}>
                <Row gutter={16}>
                    <Col>
                        <Form.Item style={whiteText} label='Owner Bitcoin Address:' name='bitcoinAddress'>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item>
                            <Button htmlType='submit' type="primary" block>Look up</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            {address && <OrdinalList bitcoinAddress={address} />}
        </>
    );
};

function OrdinalList({ bitcoinAddress }: { bitcoinAddress: string }) {
    const [isInscriptionDetailVisible, setIsInscriptionDetailVisible] = useState<boolean>(false);
    const [inscription, setInscription] = useState<any>({});
    const {
        data,
        error,
        isFetching,
        fetchNextPage,
        hasNextPage,
    } = useOrdinals(bitcoinAddress);

    const handleInscriptionDetail = (payload: any) => {
        setInscription(payload);
        setIsInscriptionDetailVisible(true);
    };

    const handleCloseInscriptionDetail = () => {
        setIsInscriptionDetailVisible(false);
    }

    const onLoadMore = () => {
        fetchNextPage();
    };

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }

    return (
        <>
            <p>Results</p>
            {
                data?.pages?.map((ordinalsData) => (
                    <React.Fragment key={ordinalsData.offset}>
                        <List
                            loading={isFetching}
                            itemLayout='horizontal'
                            dataSource={ordinalsData?.results}
                            footer={null}
                            style={{ color: 'white', width: '100%', textAlign: 'center' }}
                            renderItem={item => {
                                return item?.inscriptions?.map((inscription: any) => (
                                    <Row justify='center'>
                                        <List.Item
                                            id={inscription?.id}
                                            style={{
                                                color: 'white',
                                                width: '100%',
                                                margin: '1.5em auto 0 auto',
                                                padding: '1.5em'
                                            }}
                                        >
                                            <Col span={18}>
                                                <Text style={{ width: '100%', color: 'white' }}>
                                                    {'Inscriptions '}
                                                </Text>
                                                <Space />
                                                <Text style={{ width: '100%', color: 'white' }} copyable>
                                                    {inscription.id}
                                                </Text>
                                            </Col>
                                            <Col span={6}>
                                                <Button
                                                    style={{ color: 'white' }}
                                                    type='link'
                                                    onClick={() => {
                                                        handleInscriptionDetail(inscription);
                                                    }}
                                                >
                                                    <ArrowRightOutlined />
                                                </Button>
                                            </Col>
                                        </List.Item>
                                    </Row>
                                ));

                            }}
                        />
                    </React.Fragment>
                ))
            }


            {
                hasNextPage && !isFetching && (
                    <Button onClick={onLoadMore} type='primary'>Load More</Button>
                )
            }

            <Drawer styles={{
                body: {
                    backgroundColor: '#1A1A1A',
                    color: 'white',
                },
            }} title='Details' width={640} open={isInscriptionDetailVisible} placement="right" closable={false} onClose={handleCloseInscriptionDetail}>
                <InscriptionDetail bitcoinAddress={bitcoinAddress} inscriptionId={inscription?.id} />
            </Drawer>
        </>
    )
}

function InscriptionRawContent({ inscriptionId }: { inscriptionId: string }) {
    const { data } = useInscriptionsContent(inscriptionId);

    return (
        <Paragraph style={whiteText}>
            <pre>{JSON.stringify(data)}</pre>
        </Paragraph>
    );
}

function InscriptionDetail({ inscriptionId, bitcoinAddress }: { inscriptionId: string, bitcoinAddress: string }) {
    const { data } = useInscriptionsDetails(bitcoinAddress, inscriptionId);

    const getInscriptionContent = () => {
        if (isImageMIMEType(data?.content_type)) {
            return <Image
                src={`https://ord.xverse.app/content/${inscriptionId}`}
            />
        }

        return <InscriptionRawContent inscriptionId={inscriptionId} />
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    {getInscriptionContent()}
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Title style={whiteText} level={4}>Inscription {data?.number}</Title>
                </Col>
            </Row>

            <Divider />

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Inscription ID' />
                </Col>
                <Col span={24}>
                    <p>{data?.id}</p>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Owner Address' />
                </Col>
                <Col span={24}>
                    <p>{data?.address}</p>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Title style={whiteText} level={4}>Attributes</Title>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Output Value' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.value}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Content Type' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.content_type}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Content Length' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.content_length}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Location' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.location}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Genesis Transaction' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.genesis_address}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Genesis Block Height' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.genesis_block_height}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Genesis Block Hash' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.genesis_block_hash}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Genesis Transaction ID' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.genesis_tx_id}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Genesis Fee' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.genesis_fee}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Genesis Timestamp' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.genesis_timestamp}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Location' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.location}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Output' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.output}</pre>
                    </Paragraph>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <InscriptionInputTitle title='Offset' />
                </Col>
                <Col span={24}>
                    <Paragraph style={whiteText}>
                        <pre>{data?.offset}</pre>
                    </Paragraph>
                </Col>
            </Row>

        </>
    );
}

function InscriptionInputTitle({ title }: { title: string }) {
    return <p style={whiteTitle}>{title}</p>;
}