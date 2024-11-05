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
    address public maImpl = vm.envOr("MA_IMPL", address(0));

    // Load plugins contract, if not in env, deploy new contract
    address public sessionKeyPlugin = vm.envOr("SESSION_KEY_PLUGIN", address(0));

    // Load optional salts for create2
    bytes32 public sessionKeyPluginSalt = vm.envOr("SESSION_KEY_PLUGIN_SALT", bytes32(0));

    // Load optional expected addresses during creation, if any
    address public expectedSessionKeyPlugin = vm.envOr("EXPECTED_SESSION_KEY_PLUGIN", address(0));

    function run() public {
        console.log("******** Deploying *********");
        console.log("Chain: ", block.chainid);
        console.log("EP: ", entryPointAddr);
        console.log("Factory owner: ", owner);
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        // Deploy SessionKeyPlugin
        if (sessionKeyPlugin == address(0)) {
            sessionKeyPlugin = address(new SessionKeyPlugin{salt: sessionKeyPluginSalt}());

            if (expectedSessionKeyPlugin != address(0)) {
                require(sessionKeyPlugin == expectedSessionKeyPlugin, "SessionKeyPlugin address mismatch");
            }
            console.log("New SessionKeyPlugin: ", sessionKeyPlugin);
        } else {
            console.log("Exist SessionKeyPlugin: ", sessionKeyPlugin);
        }

        console.log("******** Deploy Done! *********");
        vm.stopBroadcast();
    }
}
