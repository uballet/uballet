import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useSafeLightAccount } from '../../../hooks/useLightAccount';
import { useTransfer } from '../../../hooks/useTransfer';
import { useCheckTransferSponsorship } from '../../../hooks/useCheckTransferSponsorship';
import tokensData from '../../../../erc20sepolia.json';

type Token = {
    name: string;
    symbol: string;
    address: string;
};

type TokensData = {
    tokens: Token[];
};

function TransferScreen() {
    const account = useSafeLightAccount();
    const [toAddress, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('ETH');
    const { transferToAddress, transferTokenToAddress, loading, error, txHash } = useTransfer();
    const { checkTransferSponsorship, loading: loadingSponsorship, setIsSponsored, isSponsored } = useCheckTransferSponsorship();
    const sponsorshipCheckDisabled = loadingSponsorship || isSponsored !== null;

    const tokens: TokensData = tokensData;
    const currencies = ['ETH', ...tokens.tokens.map(token => token.symbol)];
    const tokenAddresses = tokens.tokens.reduce<{ [key: string]: `0x${string}` }>((acc, token) => {
        acc[token.symbol] = token.address as `0x${string}`;
        return acc;
    }, {});

    useEffect(() => {
        setIsSponsored(null);
    }, [toAddress]);

    return (
        <View style={{ flex: 1, alignItems: 'flex-start', paddingHorizontal: 8 }}>
            <View style={{ margin: 8 }}>
                <Text>Transfer Amount: </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <TextInput
                        placeholder='0.00001'
                        value={amount}
                        onChangeText={setAmount}
                        style={{ padding: 8, borderWidth: 1, borderRadius: 8, flex: 1 }}
                        keyboardType="numeric"
                    />
                    <Picker
                        selectedValue={currency}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue: string) => setCurrency(itemValue)}
                    >
                        {currencies.map((curr, index) => (
                            <Picker.Item key={index} label={curr} value={curr} />
                        ))}
                    </Picker>
                </View>
                <Text>From: {account.address}</Text>
            </View>
            <Text>To Address: </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', padding: 2, borderWidth: 1, borderRadius: 8 }}>
                <Text style={{ marginLeft: 8 }}>0x</Text>
                <TextInput
                    placeholder='Address without 0x prefix'
                    value={toAddress}
                    onChangeText={setAddress}
                    style={{ padding: 8, flex: 1 }}
                />
            </View>
            {currency === 'ETH' ? (
                <>
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
                        onPress={() => checkTransferSponsorship(`0x${toAddress}`, amount)}
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
                            backgroundColor: (loading || !toAddress || !amount) ? '#CCCCCC' : 'black' 
                        }}
                        onPress={() => transferToAddress(`0x${toAddress}`, amount)}
                        disabled={loading}
                    >
                        <Text style={{ color: 'white' }}>Transfer ETH!</Text>
                    </Pressable>
                </>
            ) : (
                <View>
                    <Pressable
                        style={{
                            alignSelf: 'center',
                            margin: 16,
                            padding: 8,
                            borderRadius: 8,
                            backgroundColor: (loading || !toAddress || !amount) ? '#CCCCCC' : 'black' 
                        }}
                        onPress={() => transferTokenToAddress(tokenAddresses[currency], `0x${toAddress}`, amount)}
                        disabled={loading}
                    >
                        <Text style={{ color: 'white' }}>Transfer!</Text>
                    </Pressable>
                </View>
            )}
            {txHash && <Text selectable>{txHash}</Text>}
            {error && <Text style={{ color: 'red' }}>Something went wrong!</Text>}
        </View>
    );
}

export default TransferScreen;
