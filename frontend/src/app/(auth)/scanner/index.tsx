import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { Camera, CameraView, PermissionStatus } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthContext } from "../../../providers/AuthProvider";

const QrScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const screenBack = useLocalSearchParams<{ screenBack: string }>()?.screenBack;
  const { requiresLocalAuthentication, temporarilyDisableAuth } = useAuthContext();

  useEffect(() => {
    const init = async () => {
      try {
        temporarilyDisableAuth();
        
        const response = await Camera.requestCameraPermissionsAsync();
        setHasPermission(response.status === PermissionStatus.GRANTED);
      } catch (error) {
        console.error('Camera permission failed:', error);
        router.back();
      }
    };

    init();
  }, []);

  const parseQRCodeData = (data: string) => {
    let currency = "";
    let address = "";
    let amount = "";
    let wcuri = "";

    console.log(`QR code data: ${data}`);
    const bitcoinUriPattern =
      /^bitcoint:([13][a-km-zA-HJ-NP-Z1-9]{25,34})(\?amount=([0-9\.]+))$/;
    const ethereumUriPattern =
      /^ethereum:(0x[a-fA-F0-9]{40})(\?amount=)?([0-9\.]+)?$/;
    const bitcoinMatches = data.match(bitcoinUriPattern);
    const ethereumMatches = data.match(ethereumUriPattern);
    const wcuriMatches = data.match(/^wc:(.*)/);

    try {
      if (bitcoinMatches) {
        currency = "BTC";
        address = bitcoinMatches[1];
        amount = bitcoinMatches[2];
      }

      if (ethereumMatches) {
        currency = "ETH";
        address = ethereumMatches[1];
        amount = ethereumMatches[3];
      }

      if (wcuriMatches) {
        wcuri = data;
      }

      console.log(`WC: ${wcuri}`);
    } catch (error) {
      console.error("Failed to parse QR code data:", error);
    }

    return { currency, address, amount, wcuri };
  };
    
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={{ width: 300, height: 300 }}
        onBarcodeScanned={
          scanned
            ? undefined
            : ({ data }) => {
                setScanned(true);
                if (data === null) {
                  Alert.alert("Invalid QR", data, [{ text: "OK" }]);
                  return;
                }

                const { currency, address, amount, wcuri } = parseQRCodeData(data);

                if (wcuri) {
                  router.navigate({
                    pathname: screenBack,
                    params: { wcuri },
                  });
                } else if (address && amount && currency) {
                  router.push({
                    pathname: "/transfer/gas-info",
                    params: { toAddress: address, amount, currency },
                  });
                } else if (address) {
                  router.push({
                    pathname: "/transfer/amount-and-currency",
                    params: { toAddress: address },
                  });
                }
              }
        }
      />

      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QrScannerScreen;
