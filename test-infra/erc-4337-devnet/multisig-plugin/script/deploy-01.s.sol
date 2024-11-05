// This file is part of Multisig Plugin.
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

import {UpgradeableModularAccount} from "@alchemy/modular-account/src/account/UpgradeableModularAccount.sol";
import {IEntryPoint} from "@alchemy/modular-account/src/interfaces/erc4337/IEntryPoint.sol";
import {BasePlugin} from "@alchemy/modular-account/src/plugins/BasePlugin.sol";

import {MultisigModularAccountFactory} from "../src/MultisigModularAccountFactory.sol";
import {MultisigPlugin} from "../src/MultisigPlugin.sol";

contract Deploy is Script {
    // Load entrypoint from env
    address public entryPointAddr = vm.envAddress("ENTRYPOINT");
    IEntryPoint public entryPoint = IEntryPoint(payable(entryPointAddr));

    // Load factory owner from env
    address public owner = vm.envAddress("OWNER");

    // Multisig plugin
    address public multisigPlugin = vm.envOr("MULTISIG_PLUGIN", address(0));
    bytes32 public multisigPluginSalt = vm.envOr("MULTISIG_PLUGIN_SALT", bytes32(0));
    bytes32 public multisigPluginManifestHash;
    address public expectedMultisigPlugin = vm.envOr("EXPECTED_MULTISIG_PLUGIN", address(0));

    function run() public {
        console.log("******** Deploying *********");
        console.log("Chain: ", block.chainid);
        console.log("EP: ", entryPointAddr);
        console.log("Factory owner: ", owner);

        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // Deploy multisig plugin, and set plugin hash
        if (multisigPlugin == address(0)) {
            multisigPlugin = address(new MultisigPlugin{salt: multisigPluginSalt}(address(entryPoint)));

            if (expectedMultisigPlugin != address(0)) {
                require(multisigPlugin == expectedMultisigPlugin, "MultisigPlugin address mismatch");
            }
            console.log("New MultisigPlugin: ", multisigPlugin);
        } else {
            console.log("Exist MultisigPlugin: ", multisigPlugin);
        }
        multisigPluginManifestHash = keccak256(abi.encode(BasePlugin(multisigPlugin).pluginManifest()));

        vm.stopBroadcast();
    }
}
