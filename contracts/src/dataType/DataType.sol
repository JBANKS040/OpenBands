pragma solidity ^0.8.25;

library DataType {

    struct PublicInput {
        //string jwtPubkeyModulusLimbs;
        string domain;
        string position;
        string salary;
        uint8 workLifeBalance;
        uint8 cultureValues;
        uint8 careerGrowth;
        uint8 compensationBenefits; 
        uint8 leadershipQuality;
        uint8 operationalEfficiency;
        bytes32 nullifierHash;
        uint256 createdAt;  // @dev - block.timestamp
    }

}