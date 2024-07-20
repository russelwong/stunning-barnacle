import { useQuery } from '@tanstack/react-query';
import httpClient from '../helpers/httpClient';

const KEYS = {
    ordinals: 'ordinals',
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
}