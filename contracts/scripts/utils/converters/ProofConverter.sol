pragma solidity ^0.8.17;


/**
 * @title ProofConverter library
 */
library ProofConverter {
    /**
     * @dev - Utility function, because the proof file includes the public inputs at the beginning
     * @dev - In case of that there are 2 public inputs (bytes32 * 2 = 64 bytes), the proof file includes 64 bytes of the public inputs at the beginning. Hence it should be removed by using this function.
     */
    function sliceAfter64Bytes(bytes memory data) internal pure returns (bytes memory) {
        uint256 length = data.length - 64;
        bytes memory result = new bytes(data.length - 64);
        for (uint i = 0; i < length; i++) {
            result[i] = data[i + 64];
        }
        return result;
    }

    /**
     * @dev - Utility function, because the proof file includes the public inputs at the beginning
     * @dev - In case of that there are 3 public inputs (bytes32 * 3 = 96 bytes), the proof file includes 96 bytes of the public inputs at the beginning. Hence it should be removed by using this function.
     */
    function sliceAfter96Bytes(bytes memory data) internal pure returns (bytes memory) {
        uint256 length = data.length - 96;
        bytes memory result = new bytes(data.length - 96);
        for (uint i = 0; i < length; i++) {
            result[i] = data[i + 96];
        }
        return result;
    }
}