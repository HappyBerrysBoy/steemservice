var express = require("express");
var router = express.Router();
const steem = require("steem");
const axios = require("axios");

const rpcUrl = "https://api.steemit.com";

/* GET users listing. */
router.get("/witnesses", function (req, res, next) {
  // 증인 리스트 가져오기
  const params = {
    jsonrpc: "2.0",
    method: "call",
    params: ["database_api", "get_witnesses_by_vote", ["", 300]],
    id: 1,
  };

  axios.post(rpcUrl, params).then((r) => {
    if (!r.data.result.length) return;

    const witList = [];

    r.data.result.forEach((d, idx) => {
      witList.push({
        name: d.owner,
        rank: idx + 1,
        votes: d.votes,
        votes_count: 0,
      });
    });

    // console.log(witList);
    res.json(witList);
  });
});

module.exports = router;
