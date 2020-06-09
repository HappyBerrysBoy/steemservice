const steem = require("steem");
const fs = require("fs");

const account = "steem-agora";
const logFileName = "./logs/hst_steem_agora_log_";
const targetMonth = "2020-06";
const targetDay = "2020-06-01";
let vesting_shares = 0;
let count = 0;
const blockList = [];
const divide = 10000;

function decimalFloor(num, digit) {
  return Math.floor(num * Math.pow(10, digit)) / Math.pow(10, digit);
}

function getBlocks(start, count) {
  return new Promise((resolve) => {
    steem.api.getAccountHistory(account, start, count, (err, result) => {
      return resolve(result);
    });
  });
}

agora();
async function agora() {
  try {
    const [global, lastblockno] = await Promise.all([
      steem.api.getDynamicGlobalPropertiesAsync(),
      getBlocks(-1, 0),
    ]);
    const total_vests = parseFloat(global.total_vesting_shares.split(" ")[0]);
    const total_vest_steem = parseFloat(
      global.total_vesting_fund_steem.split(" ")[0]
    );

    const ttlBlockCount = lastblockno[0][0];
    for (let i = 0; i <= ttlBlockCount / divide; i++) {
      let start = -1;

      if (i > 0) start = divide * i + 1;

      let virtualops = await getBlocks(
        divide * (i + 1),
        divide * (i + 1) < ttlBlockCount ? divide : ttlBlockCount % divide
      );

      virtualops = virtualops.filter(
        (operation) => operation[1].op[0] === "producer_reward"
      );

      for (let virtualop of virtualops) {
        operation = virtualop[1];

        // if (operation.timestamp.substring(0, 7) != targetMonth) continue;
        if (operation.timestamp.substring(0, 10) != targetDay) continue;

        if (blockList.indexOf(operation.block) > -1) {
          blockList.push[operation.block];
        } else {
          blockList.push[operation.block];
        }

        const vesting_steemf =
          total_vest_steem *
          (parseFloat(operation.op[1].vesting_shares.split(" ")[0]) /
            total_vests);
        vesting_shares += decimalFloor(vesting_steemf, 3);
        count++;
        console.log(
          count,
          virtualop[0],
          operation.block,
          operation.timestamp,
          decimalFloor(vesting_steemf, 3),
          vesting_shares
        );
        fs.appendFile(
          logFileName + operation.timestamp.split("T")[0] + ".txt",
          JSON.stringify(virtualop) + "\n",
          (err) => {
            if (err) console.log(err);
          }
        );
      }
    }
  } catch (e) {}
}
