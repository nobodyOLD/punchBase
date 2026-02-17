export const PUNCH_BASE_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Local Hardhat address

export const PUNCH_BASE_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "fighterAddresses",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllFighterAddresses",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFighterCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "matchId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "challenger",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "opponent",
                "type": "address"
            }
        ],
        "name": "ChallengeCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "FighterCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "matchId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "winner",
                "type": "address"
            }
        ],
        "name": "MatchEnded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "matchId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "player1",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "player2",
                "type": "address"
            }
        ],
        "name": "MatchStarted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "matchId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "action",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "damage",
                "type": "uint256"
            }
        ],
        "name": "TurnTaken",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_matchId",
                "type": "uint256"
            }
        ],
        "name": "acceptChallenge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_opponent",
                "type": "address"
            }
        ],
        "name": "challengePlayer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "_class",
                "type": "uint8"
            }
        ],
        "name": "createFighter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "fighters",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint8",
                "name": "fClass",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "health",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "attack",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "defense",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "wins",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "losses",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "exists",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_addr",
                "type": "address"
            }
        ],
        "name": "getFighter",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint8",
                        "name": "fClass",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "health",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attack",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "defense",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "wins",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "losses",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "exists",
                        "type": "bool"
                    }
                ],
                "internalType": "struct PunchBaseGame.Fighter",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_matchId",
                "type": "uint256"
            }
        ],
        "name": "getMatch",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "player1",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "player2",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "turn",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "player1Health",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "player2Health",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "player1Defending",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "player2Defending",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "winner",
                        "type": "address"
                    }
                ],
                "internalType": "struct PunchBaseGame.Match",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "matches",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "player1",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "player2",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "turn",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "player1Health",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "player2Health",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "player1Defending",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "player2Defending",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "winner",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextMatchId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_matchId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_action",
                "type": "uint256"
            }
        ],
        "name": "takeTurn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;
