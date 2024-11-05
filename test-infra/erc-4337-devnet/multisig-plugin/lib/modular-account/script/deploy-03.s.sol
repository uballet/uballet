// This file is part of Modular Account.
//
// Copyright 2024 Alchemy Insights, Inc.
//
// SPDX-License-Identifier: GPL-3.0-or-later
//
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General
// Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
// option) any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
// implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with this program. If not, see
// <https://www.gnu.org/licenses/>.

pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Test.sol";

import {IEntryPoint as I4337EntryPoint} from "@eth-infinitism/account-abstraction/interfaces/IEntryPoint.sol";

import {UpgradeableModularAccount} from "../src/account/UpgradeableModularAccount.sol";
import {MultiOwnerModularAccountFactory} from "../src/factory/MultiOwnerModularAccountFactory.sol";
import {IEntryPoint} from "../src/interfaces/erc4337/IEntryPoint.sol";
import {BasePlugin} from "../src/plugins/BasePlugin.sol";
import {MultiOwnerPlugin} from "../src/plugins/owner/MultiOwnerPlugin.sol";
import {SessionKeyPlugin} from "../src/plugins/session/SessionKeyPlugin.sol";

contract Deploy is Script {
    // Load entrypoint from env
    address public entryPointAddr = vm.envAddress("ENTRYPOINT");
    IEntryPoint public entryPoint = IEntryPoint(payable(entryPointAddr));

    // Load factory owner from env
    address public owner = vm.envAddress("OWNER");

    // Load core contract, if not in env, deploy new contract
    address public maImpl = vm.envAddress("EXPECTED_MA_IMPL");
    address public factory = vm.envOr("FACTORY", address(0));

    // Load plugins contract, if not in env, deploy new contract
    address public multiOwnerPlugin = vm.envAddress("EXPECTED_OWNER_PLUGIN");
    bytes32 public multiOwnerPluginManifestHash;

    // Load optional salts for create2
    bytes32 public factorySalt = vm.envOr("FACTORY_SALT", bytes32(0));

    // Load optional expected addresses during creation, if any
    address public expectedFactory = vm.envOr("EXPECTED_FACTORY", address(0));

    function run() public {
        console.log("******** Deploying *********");
        console.log("Chain: ", block.chainid);
        console.log("EP: ", entryPointAddr);
        console.log("Factory owner: ", owner);
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        multiOwnerPluginManifestHash = keccak256(abi.encode(BasePlugin(multiOwnerPlugin).pluginManifest()));

        // Deploy factory
        if (factory == address(0)) {
            factory = address(
                new MultiOwnerModularAccountFactory{salt: factorySalt}(
                    owner, multiOwnerPlugin, maImpl, multiOwnerPluginManifestHash, entryPoint
                )
            );

            if (expectedFactory != address(0)) {
                require(factory == expectedFactory, "MultiOwnerModularAccountFactory address mismatch");
            }
            _addStakeForFactory(factory, entryPoint);
            console.log("New MultiOwnerModularAccountFactory: ", factory);
        } else {
            console.log("Exist MultiOwnerModularAccountFactory: ", factory);
        }
        vm.stopBroadcast();
    }

    function _addStakeForFactory(address factoryAddr, IEntryPoint anEntryPoint) internal {
        uint32 unstakeDelaySec = uint32(vm.envOr("UNSTAKE_DELAY_SEC", uint32(86400)));
        uint256 requiredStakeAmount = vm.envUint("REQUIRED_STAKE_AMOUNT");
        uint256 currentStakedAmount = I4337EntryPoint(address(anEntryPoint)).getDepositInfo(factoryAddr).stake;
        uint256 stakeAmount = requiredStakeAmount - currentStakedAmount;
        // since all factory share the same addStake method, it does not matter which contract we use to cast the
        // address
        MultiOwnerModularAccountFactory(payable(factoryAddr)).addStake{value: stakeAmount}(
            unstakeDelaySec, stakeAmount
        );
        console.log("******** Add Stake Verify *********");
        console.log("Staked factory: ", factoryAddr);
        console.log("Stake amount: ", I4337EntryPoint(address(anEntryPoint)).getDepositInfo(factoryAddr).stake);
        console.log(
            "Unstake delay: ", I4337EntryPoint(address(anEntryPoint)).getDepositInfo(factoryAddr).unstakeDelaySec
        );
        console.log("******** Stake Verify Done *********");
    }
}
