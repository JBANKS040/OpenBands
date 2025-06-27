pragma solidity ^0.8.25;

library DataType {

    struct PublicInput {
        string jwtPubkeyModulusLimbs;
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
        // bytes32 jwtPubkeyModulusLimbs;
        // bytes32 domain;
        // bytes32 position;   // Position, which is part of Email Body-extracted from the Entire Email Body.
        // bytes32 salary;     // Salary, which is part of Email Body-extracted from the Entire Email Body.
        // bytes32 workLifeBalance;
        // bytes32 cultureValues;
        // bytes32 careerGrowth;
        // bytes32 compensationBenefits;
        // bytes32 leadershipQuality;
        // bytes32 operationalEfficiency;
        // bytes32 nullifierHash; // [TODO]: Email nullifierHash, which is used to prevent double submission of the same email.
    }

}