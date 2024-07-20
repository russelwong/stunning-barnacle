import { useQuery } from '@tanstack/react-query';
import httpClient from '../helpers/http-client';

const KEYS = {
    ordinals: 'ordinals',
    inscriptions: 'inscriptions',
    inscriptionContent: 'inscriptionContent',
};

type Inscription = {
    id: string;
    offset: string;
    content_type: string;
}

type Sats = {
    number: string;
    rarity_ranking: string;
    offset: number;
}

type Ordinals = {
    txid: string;
    vout: number;
    blockheight: number;
    value: number;
    inscriptions: Inscription[];
    sats: Sats[];
}

type OrdinalsQueryResult = {
    limit: number;
    offset: number;
    total: number;
    results: Ordinals[];
};

export function useOrdinals(address: string) {
    const fetchOrdinals = (): Promise<OrdinalsQueryResult> => httpClient.get(
        `https://api-3.xverse.app/v1/address/${address}/ordinal-utxo`,
    ).then((response) => response.data);

    return useQuery({
        queryKey: [KEYS.ordinals, address],
        queryFn: fetchOrdinals,
    });
};

type InscriptionDetailsQueryResult = {
    id: string;
    number: number;
    address: string;
    genesis_address: string;
    genesis_block_height: number;
    genesis_block_hash: string;
    genesis_tx_id: string;
    genesis_fee: number;
    genesis_timestamp: number;
    location: string;
    output: string;
    offset: number;
    sat_ordinal: number;
    sat_rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary'; 
    sat_coinbase_height: number;
    mime_type: string;
    content_type: string;
    content_length: number;
    tx_id: string;
    timestamp: number;
    value: number;
};

export function useInscriptionsDetails(address: string, inscriptionId: string) {
    const fetchInscriptionDetails = (): Promise<InscriptionDetailsQueryResult> => httpClient.get(
        `https://api-3.xverse.app/v1/address/${address}/ordinals/inscriptions/${inscriptionId}`,
    ).then((response) => response.data);

    return useQuery({
        queryKey: [KEYS.inscriptions, address, inscriptionId],
        queryFn: fetchInscriptionDetails,
    });
};

export function useInscriptionsContent(inscriptionId: string) {
    const fetchInscriptionContent = (): Promise<OrdinalsQueryResult> => httpClient.get(
        `https://ord.xverse.app/content/${inscriptionId}`,
    ).then((response) => response.data);

    return useQuery({
        queryKey: [KEYS.inscriptionContent, inscriptionId],
        queryFn: fetchInscriptionContent 
    });
};
