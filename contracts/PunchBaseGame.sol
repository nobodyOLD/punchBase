// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PunchBaseGame {
    enum FighterClass { BALANCED, TANK, ASSASSIN }

    struct Fighter {
        address owner;
        string name;
        FighterClass fClass;
        uint256 health;
        uint256 attack;
        uint256 defense;
        uint256 wins;
        uint256 losses;
        bool exists;
    }

    struct Match {
        uint256 id;
        address player1;
        address player2;
        address turn;
        bool active;
        uint256 player1Health;
        uint256 player2Health;
        bool player1Defending;
        bool player2Defending;
        address winner;
    }

    mapping(address => Fighter) public fighters;
    address[] public fighterAddresses;
    mapping(uint256 => Match) public matches;
    uint256 public nextMatchId;

    event FighterCreated(address indexed owner, string name, FighterClass fClass);
    event ChallengeCreated(uint256 indexed matchId, address indexed challenger, address indexed opponent);
    event MatchStarted(uint256 indexed matchId, address player1, address player2);
    event TurnTaken(uint256 indexed matchId, address indexed player, uint256 action, uint256 damage);
    event MatchEnded(uint256 indexed matchId, address indexed winner);

    function createFighter(string memory _name, FighterClass _class) external {
        require(!fighters[msg.sender].exists, "Fighter already exists");
        
        uint256 hp = 100;
        uint256 atk = 15;
        uint256 def = 5;

        if (_class == FighterClass.TANK) {
            hp = 150;
            atk = 10;
            def = 10;
        } else if (_class == FighterClass.ASSASSIN) {
            hp = 80;
            atk = 25;
            def = 2;
        }

        fighters[msg.sender] = Fighter({
            owner: msg.sender,
            name: _name,
            fClass: _class,
            health: hp,
            attack: atk,
            defense: def,
            wins: 0,
            losses: 0,
            exists: true
        });
        fighterAddresses.push(msg.sender);
        emit FighterCreated(msg.sender, _name, _class);
    }

    function getAllFighterAddresses() external view returns (address[] memory) {
        return fighterAddresses;
    }

    function getFighterCount() external view returns (uint256) {
        return fighterAddresses.length;
    }

    function challengePlayer(address _opponent) external {
        require(fighters[msg.sender].exists, "Create a fighter first");
        require(fighters[_opponent].exists, "Opponent does not have a fighter");
        require(msg.sender != _opponent, "Cannot challenge yourself");

        uint256 matchId = nextMatchId++;
        matches[matchId].id = matchId;
        matches[matchId].player1 = msg.sender;
        matches[matchId].player2 = _opponent;
        matches[matchId].active = false;
        matches[matchId].player1Health = fighters[msg.sender].health;
        matches[matchId].player2Health = fighters[_opponent].health;

        emit ChallengeCreated(matchId, msg.sender, _opponent);
    }

    function acceptChallenge(uint256 _matchId) external {
        Match storage m = matches[_matchId];
        require(m.player2 == msg.sender, "Only opponent can accept");
        require(!m.active, "Match already active");
        require(m.winner == address(0), "Match already ended");

        m.active = true;
        m.turn = m.player1;

        emit MatchStarted(_matchId, m.player1, m.player2);
    }

    function takeTurn(uint256 _matchId, uint256 _action) external {
        Match storage m = matches[_matchId];
        require(m.active, "Match not active");
        require(m.turn == msg.sender, "Not your turn");

        uint256 damage = 0;
        bool isPlayer1 = (msg.sender == m.player1);
        address opponent = isPlayer1 ? m.player2 : m.player1;

        if (_action == 0) { // Attack
            Fighter storage attacker = fighters[msg.sender];
            Fighter storage target = fighters[opponent];
            
            // Base damage = attack stat + random(0-5)
            uint256 baseDamage = attacker.attack + (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _matchId))) % 6);
            
            // Damage reduction = target defense
            if (baseDamage > target.defense) {
                damage = baseDamage - target.defense;
            } else {
                damage = 1; // Minimum 1 damage
            }
            
            if (isPlayer1) {
                if (m.player2Defending) {
                    damage = damage / 2;
                    m.player2Defending = false;
                }
                if (m.player2Health <= damage) {
                    m.player2Health = 0;
                    _endMatch(_matchId, m.player1);
                } else {
                    m.player2Health -= damage;
                }
            } else {
                if (m.player1Defending) {
                    damage = damage / 2;
                    m.player1Defending = false;
                }
                if (m.player1Health <= damage) {
                    m.player1Health = 0;
                    _endMatch(_matchId, m.player2);
                } else {
                    m.player1Health -= damage;
                }
            }
        } else if (_action == 1) { // Defend
            if (isPlayer1) {
                m.player1Defending = true;
            } else {
                m.player2Defending = true;
            }
        }

        if (m.active) {
            m.turn = isPlayer1 ? m.player2 : m.player1;
        }

        emit TurnTaken(_matchId, msg.sender, _action, damage);
    }

    function _endMatch(uint256 _matchId, address _winner) internal {
        Match storage m = matches[_matchId];
        m.active = false;
        m.winner = _winner;
        
        address loser = (_winner == m.player1) ? m.player2 : m.player1;
        fighters[_winner].wins++;
        fighters[loser].losses++;

        emit MatchEnded(_matchId, _winner);
    }

    function getMatch(uint256 _matchId) external view returns (Match memory) {
        return matches[_matchId];
    }
    
    function getFighter(address _addr) external view returns (Fighter memory) {
        return fighters[_addr];
    }
}
