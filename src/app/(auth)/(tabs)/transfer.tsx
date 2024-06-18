import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useSafeLightAccount } from '../../../hooks/useLightAccount';
import { useTransfer } from '../../../hooks/useTransfer';
import { useCheckTransferSponsorship } from '../../../hooks/useCheckTransferSponsorship';

const TRANSFER_AMOUNT = '0.00001' //(eth)
function TransferScreen() {
    const account = useSafeLightAccount()
    const [toAddress, setAddress] = useState('')
    const { transferToAddress, loading, error, txHash } = useTransfer()
    const { checkTransferSponsorship, loading: loadingSponsorship, setIsSponsored, isSponsored } = useCheckTransferSponsorship()
    const sponsorshipCheckDisabled = loadingSponsorship || isSponsored !== null

    useEffect(() => {
        setIsSponsored(null)
    }, [toAddress])

    return (
        <View style={{ flex: 1, alignItems: 'flex-start', paddingHorizontal: 8 }}>
            <View style={{ margin: 8}}>
                <Text>Transfer 0.00001 eth</Text>
                <Text>From: {account.address}</Text>
            </View>
            <Text>To Address: </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', padding: 2, borderWidth: 1, borderRadius: 8 }}>
                <Text style={{ marginLeft: 8 }}>0x</Text>
                <TextInput
                    placeholder='Address without 0x prefix'
                    value={toAddress}
                    onChangeText={setAddress}
                    style={{ padding: 8 }}
                />
            </View>
            <Pressable
                style={{
                    alignSelf: 'center',
                    margin: 16,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: !sponsorshipCheckDisabled
                        ? 'black'
                        : loadingSponsorship
                            ? '#CCCCCC'
                            : isSponsored
                                ? 'green'
                                : 'red'
                }}
                disabled={sponsorshipCheckDisabled}
                onPress={() => checkTransferSponsorship(`0x${toAddress}`, TRANSFER_AMOUNT)}
            >
                {loadingSponsorship
                    ? <ActivityIndicator />
                    : <Text style={{ color: 'white' }}>{isSponsored ? "We'll pay for gas!"
                        : isSponsored === null
                            ? 'Check sponsorship'
                            : "You'll pay for gas"
                }</Text>}
            </Pressable>
            <Pressable
                style={{
                    alignSelf: 'center',
                    margin: 16,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: (loading || !toAddress) ? '#CCCCCC': 'black' 
                }}
                onPress={() => transferToAddress(`0x${toAddress}`, TRANSFER_AMOUNT)}
                disabled={loading}
            >
                <Text style={{ color: 'white' }}>Transfer ETH!</Text>
            </Pressable>
            {txHash && <Text selectable>{txHash}</Text>}
            {error && <Text style={{ color: 'red' }}>Something went wrong!</Text>}
        </View>
    );

}

export default TransferScreen
