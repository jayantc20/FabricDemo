var async = require("../utils/asyncMiddleware.js");
var invoke = require("../modules/invokeChaincode.js");
var query = require("../modules/queryChaincode.js");

const invokeTransaction = async.asyncMiddleware(async (req, res) => {
  const { peers, fcn, args } = req.body;
  const { chaincodeName, channelName } = req.params;

  const response = await invoke.invokeChaincode(
    peers,
    channelName,
    chaincodeName,
    fcn,
    args,
    req.username,
    req.orgname
  );

  res.json(response);
});

const queryTransaction = async.asyncMiddleware(async (req, res) => {
  let { peer, fcn, args } = req.query;
  const { chaincodeName, channelName } = req.params;

  args = args.replace(/'/g, '"');
  args = JSON.parse(args);

  const response = await query.queryChaincode(
    peer,
    channelName,
    chaincodeName,
    args,
    fcn,
    req.username,
    req.orgname
  );
  try {
    let parseresponse = JSON.parse(response);

    if (Array.isArray(parseresponse)) {
      res.json(parseresponse);
    } else {
      let parsemeta = JSON.parse(parseresponse.metadata);
      let result = {
        hash: parseresponse.hash,
        metadata: parsemeta,
      };
      res.json(result);
    }
    res.send(response);
 } 
  catch (error) {
    res.status(404).json(response);
    throw new Error(error);
  }
});

exports.invokeTransaction = invokeTransaction;
exports.queryTransaction = queryTransaction;

