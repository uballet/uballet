import { EmailVerificationCode } from "./entity/EmailVerificationCode";
import { Notification } from "./entity/Notification";
import { RecoveryRequest } from "./entity/RecoveryRequest";
import { RecoveryTeam } from "./entity/RecoveryTeam";
import { User } from "./entity/User";
import { IS_E2E_TESTING } from "./env";
import { Address } from "./types";


const FUNDED_ADDRESSES: Address[] = [
    "0xeFeC29d4FfF7c0A14ad99990964161Eb1123E017",
    "0x159264e6a27E3722481914dbadb1510981d30Afa",
    "0xFd4c247400DA2D63710D289904fe82aeA203Bf8E",
    "0xF56BDd0C96A4C4056F2AF515Fe87964eA6Ef6213",
    "0x6a33287e08Aa3C88b4B725645aeD33742d357B38",
    "0x336374AeeE082bE99878815Fc72A23cC28F3C391",
    "0xc84Ad4dB0821b50726309a38f1bA7777c840412f",
    "0x356434b93720aC5Ce8Df68e691Ce27d1Cf06DCb0",
    "0x63A635C77F4f8a50959e5130BDdc08599329072a",
    "0x86541C378C38A255e68F170ee407E4A437d8a93b",
    "0xb156940fCaBd9ccEf7e276BFFE145dE4305C111a",
    "0x4c84FcabaC95B4cD71541201C264610f30F007d5",
    "0x74242a59b9FC5676eFb9a759f88781c31B63D2AF",
    "0x9625e71C5393CD11b367aFb9B6cD78f8E60BbE79",
    "0xd04609367a4730d266f079b3E0B9e682220B3231",
    "0x62e03Df68473a5c53Cf421De9Eb131fCb4b98D20",
    "0x7344727887023cC4632D7F291976F6cbc3Dad794",
    "0x8717Bc31d0D3959b3D3C94B187Fb6D540426302C",
    "0x63CeDF544Fda2C18b08C573a35cB8Df6B0Fca6A9"
  ];
  
  const UNFUNED_ADDRESSES: Address[] = [
    "0xE8A48C728670376D28F3A3cEe3E8CF021ca61d40",
    "0xe10b9B95d02C2FDA856055dB60b50aDEeCD7a93b",
    "0xF7757e24B87F8784DfF95d3839d33B7E27c494f7",
    "0x9301349Abe9b16D5e3c11209A3a2c69ad35f75c1",
    "0xB0Fb17865D32542d9E578B49CA14A3a8B8129BFB",
    "0x8e0119D1484603D62A2FeB8e8757e23C547Bae10",
    "0x3e1458951475e30711cd5B7BC5108ACEdCd0489c",
    "0x413D26C2eEe8F4A4442e27Ab3A638ca6729b53f9",
    "0xb62D3cF9Cd20f13366bb2aa5d9EFB17930EEbA31",
    "0x8862958c34f18D35ce98B826dA6B29bD94d4Bb2a",
    "0x367b7CcBB55194D58357ABA972f2D0240f9D65F7",
    "0x7EA5d8c604ea6ACdBA094b2a69d52b69BDffCE42",
    "0x727D2bf86e9B3A879167cEBfcc6E300811bB3819",
    "0xC4371733Df6796cE10d497eE3fC905e4caD3ABbB",
    "0xF08c21DC7592569f9267B3dA9Ab87326Fc5318F2",
    "0x5Dce02Cd355f668776cA242Fe48F93bf2af542E6",
    "0x5Eca8669863F43629625097f7Ad1a2Acff356226",
    "0xf9FE25298695912B94EF5b8ec3F1bdc8aeBF768A",
    "0xCad06b397c1C4dD3238b51e98F79b2d8cC7c70C7",
    "0x54Aa7bc785B70994D42519a0e6923857ADf045BF"
  ];
  

export async function initTestDB() {
    if (!IS_E2E_TESTING) {
        return
    }

    const newUsers = []
    for (let i = 0; i < FUNDED_ADDRESSES.length; i++) {
        const user = new User()
        user.email = `funded-${i}@test.com`
        user.verified = true
        user.walletAddress = FUNDED_ADDRESSES[i]
        user.walletType = "multisig"
        user.verified = true

        newUsers.push(user)
    }
    
    for (let i = 0; i < UNFUNED_ADDRESSES.length; i++) {
        const user = new User()
        user.email = `unfunded-${i}@test.com`
        user.verified = true
        user.walletAddress = UNFUNED_ADDRESSES[i]
        user.walletType = "multisig"
        user.verified = true

        newUsers.push(user)
    }

    for (let i = 0; i < 10; i++) {
        const user = new User()
        user.email = `unverified-${i}@test.com`
        user.verified = false
        newUsers.push(user)
    }


    await User.save(newUsers)
}

export async function clearTestDB() {
    if (!IS_E2E_TESTING) {
        return
    }

    await EmailVerificationCode.delete({});
    await Notification.delete({})
    await RecoveryRequest.delete({});
    await RecoveryTeam.delete({});
    await User.delete({});
}
