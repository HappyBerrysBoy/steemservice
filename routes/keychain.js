var express = require("express");
var router = express.Router();
const steem = require("steem");
const axios = require("axios");

const rpcUrl = "https://api.steemit.com";

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

    const list = [];

    r.data.result.forEach((d, idx) => {
      list.push({
        name: d.owner,
        rank: idx + 1,
        votes: d.votes,
        votes_count: 0,
      });
    });

    // console.log(list);
    res.json(list);
  });
});

router.get("/delegator/:account", function (req, res, next) {
  const account = req.params.account;

  const params = {
    jsonrpc: "2.0",
    method: "call",
    params: ["database_api", "get_vesting_delegations", [account, "", 1000]],
    id: 1,
  };

  axios.post(rpcUrl, params).then((r) => {
    if (!r.data.result.length) return;

    const list = [];

    r.data.result.forEach((d, idx) => {
      list.push({
        delegator: d.delegatee,
        vesting_shares: parseFloat(d.vesting_shares.split(" ")[0]),
        delegation_date: d.min_delegation_time,
      });
    });

    res.json(list);
  });
});

module.exports = router;
