/**
 * @notice - HTTP response data from the Workday's Payroll page for testing purpose.
 */

// HTTP/1.1 200 OK
// content-type: application/json; charset=utf-8
// content-encoding: gzip
// Transfer-Encoding: chunked

// {
//    "data": {
//        "items": [
//            {
//                "data": "Artist",
//                "profile": {
//                 "name": "Taylor Swift"
//                }
//            }
//        ]
//    }
// }
pub fn response() -> [u8; 320] {
    [
        // @dev - [TODO]: Add bytes data of Workday HTTP response (of payroll) to here.
    ]
}

//   72, 84, 84, 80, 47, 49, 46, 49, 32, 50, 48, 48, 32, 79, 75,
pub fn start_line() -> [Field; 15] {
    //"HTTP/1.1 200 OK".as_bytes().map(|x| x as Field)
}

// [
//   99, 111, 110, 116, 101, 110, 116, 45, 116, 121, 112, 101, 58, 32, 97, 112,
//   112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 106, 115, 111, 110, 59, 32, 99,
//   104, 97, 114, 115, 101, 116, 61, 117, 116, 102, 45, 56,
// ];
pub fn header_0() -> [Field; 45] {
    //"content-type: application/json; charset=utf-8".as_bytes().map(|x| x as Field)
}

// [
//   99, 111, 110, 116, 101, 110, 116, 45, 101, 110, 99, 111, 100, 105, 110, 103,
//   58, 32, 103, 122, 105, 112,
// ];
pub fn header_1() -> [Field; 22] {
    //"content-encoding: gzip".as_bytes().map(|x| x as Field)
}

pub fn header_2() -> [Field; 26] {
    //"Transfer-Encoding: chunked".as_bytes().map(|x| x as Field)
}

// {
//   "data": {
//       "items": [
//           {
//               "data": "Artist",
//               "profile": {
//                "name": "Taylor Swift"
//               }
//           }
//       ]
//   }
// }
pub fn body() -> [u8; 202] {
    [
        // @dev - [TODO]: Add bytes data of Workday HTTP response (of payroll) to here.
    ]
}